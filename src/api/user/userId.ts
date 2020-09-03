// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import userIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIdCheckHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import { patchHandler, handlePatchQuery } from '../../scripts/RequestHandler/patchHandler'
import { mysqlTEXT } from '../../scripts/types'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'
import { storePassword } from '../../scripts/security'

const router = express.Router()

// Get by userId
router.get(
  '/:userId',
  authHandler((request) => {
    if (request.params.userId === '~') {
      return 'trackless.user.readOwn'
    } else {
      return 'trackless.user.readAll'
    }
  }),
  userIdCheckHandler(),
  (request, response, next) => {
    // Get the data from the server
    DBcon.query(
      'SELECT `userId`, `firstname`, `lastname`, `username`, `groupId`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`groupId`) WHERE `userId`=?',
      [(request.params.userId === '~') ? request.user?.userId : request.params.userId],
      handleQuery(next, (result) => {
        // Send the result back
        response.status(200).json(result)
      })
    )
  }
)

// Remove a user
router.delete(
  '/:userId',
  authHandler('trackless.user.remove'),
  userIdCheckHandler(),
  (request, response, next) => {
    // Remove the user
    DBcon.query(
      'DELETE FROM `TL_users` WHERE `userId`=?',
      [request.params.userId],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'success'
        })
      })
    )
  }
)

// Edit a user
router.patch(
  '/:userId',
  authHandler((request) => {
    if (request.params.userId === '~') {
      return 'trackless.user.editOwn'
    } else {
      return 'trackless.user.editAll'
    }
  }),
  userIdCheckHandler(),
  patchHandler(
    [
      { name: 'firstname', check: mysqlTEXT },
      { name: 'lastname', check: mysqlTEXT },
      { name: 'username', check: mysqlTEXT },
      { name: 'password', check: mysqlTEXT }
    ],
    (resolve, reject, key, request) => {
      function changeUser () {
        DBcon.query(
          'UPDATE `TL_users` SET `' + key + '`=? WHERE `userId`=?',
          [
            request.body[key],
            (request.params.userId === '~') ? request.user?.userId : request.params.userId
          ],
          handlePatchQuery(reject, resolve)
        )
      }

      switch (key) {
        case 'username':
          // Check if the username has been used
          DBcon.query(
            'SELECT `userId` FROM `TL_users` WHERE `username`=?',
            [request.body.username],
            (error, result) => {
              const userId = (request.params.userId === '~') ? request.user?.userId : request.params.userId
              if (result.length === 0 || Number(result[0].userId) === Number(userId)) {
                // User name is free
                changeUser()
              } else {
                // User name has been taken
                const error: ServerError = new Error('Username has been taken')
                error.code = 'trackless.user.usernameTaken'
                reject(error)
              }

              if (error) {
                reject((new Error('Server Error') as ServerError).status = 500)
              }
            }
          )
          break
        case 'password': {
          // Update password
          const [salt, hash] = storePassword(request.body[key])

          DBcon.query('UPDATE `TL_users` SET `salt_hash`=?, `hash`=? where `userId`=?', [
            salt,
            hash,
            (request.params.userId === '~') ? request.user?.userId : request.params.userId
          ], handlePatchQuery(reject, resolve))
          break
        }
        default:
          // Save the changes
          changeUser()
      }
    }
  )
)

router.use(unusedRequestTypes())

export default router
