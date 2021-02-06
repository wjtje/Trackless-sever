// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import authHandler from '../../scripts/RequestHandler/authHandler'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIDCheckHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import { patchHandler, handlePatchQuery } from '../../scripts/RequestHandler/patchHandler'
import { mysqlTEXT } from '../../scripts/types'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'
import { storePassword } from '../../scripts/security'

const router = express.Router()

// Get by userID
router.get(
  '/:userID',
  authHandler((request) => {
    if (request.params.userID === '~') {
      return 'trackless.user.readOwn'
    } else {
      return 'trackless.user.readAll'
    }
  }),
  userIDCheckHandler(),
  (request, response, next) => {
    // Get the data from the server
    DBcon.query(
      'SELECT `userID`, `firstname`, `lastname`, `username`, `groupID`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`groupID`) WHERE `userID`=?',
      [(request.params.userID === '~') ? request.user?.userID : request.params.userID],
      handleQuery(next, (result) => {
        // Send the result back
        response.status(200).json(result)
      })
    )
  }
)

// Remove a user
router.delete(
  '/:userID',
  authHandler('trackless.user.remove'),
  userIDCheckHandler(),
  (request, response, next) => {
    // Remove the user
    DBcon.query(
      'DELETE FROM `TL_users` WHERE `userID`=?',
      [request.params.userID],
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
  '/:userID',
  authHandler((request) => {
    if (request.params.userID === '~') {
      return 'trackless.user.editOwn'
    } else {
      return 'trackless.user.editAll'
    }
  }),
  userIDCheckHandler(),
  patchHandler(
    [
      { name: 'firstname', check: mysqlTEXT },
      { name: 'lastname', check: mysqlTEXT },
      { name: 'username', check: mysqlTEXT },
      { name: 'password', check: mysqlTEXT }
    ],
    (resolve, reject, key, request, connection) => {
      function changeUser () {
        connection.query(
          'UPDATE `TL_users` SET `' + key + '`=? WHERE `userID`=?',
          [
            request.body[key],
            (request.params.userID === '~') ? request.user?.userID : request.params.userID
          ],
          handlePatchQuery(reject, resolve)
        )
      }

      switch (key) {
        case 'username':
          // Check if the username has been used
          connection.query(
            'SELECT `userID` FROM `TL_users` WHERE `username`=?',
            [request.body.username],
            (error, result) => {
              const userID = (request.params.userID === '~') ? request.user?.userID : request.params.userID
              if (result.length === 0 || Number(result[0].userID) === Number(userID)) {
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

          connection.query('UPDATE `TL_users` SET `salt_hash`=?, `hash`=? where `userID`=?', [
            salt,
            hash,
            (request.params.userID === '~') ? request.user?.userID : request.params.userID
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

export default router
