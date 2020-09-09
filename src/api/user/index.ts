// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'
import { storePassword } from '../../scripts/security'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import { mysqlTEXT, mysqlINT } from '../../scripts/types'
import userIdRouter from './userId'
import sortHandler from '../../scripts/RequestHandler/sortHandler'

const router = express.Router()

// Get all the users from the system
router.get(
  '/',
  authHandler('trackless.user.readAll'),
  sortHandler([
    'userId',
    'firstname',
    'lastname',
    'username',
    'groupId',
    'groupName'
  ]),
  (request, response, next) => {
    // Send the request
    DBcon.query(
      'SELECT `userId`, `firstname`, `lastname`, `username`, `groupId`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`groupId`) ' + String((response.locals.sort || ' ORDER BY `firstname`, `lastname`, `username`')),
      handleQuery(next, (result) => {
        response.status(200).json(result)
      })
    )
  }
)

// Create a new user
router.post(
  '/',
  authHandler('trackless.user.create'),
  requireHandler([
    { name: 'firstname', check: mysqlTEXT },
    { name: 'lastname', check: mysqlTEXT },
    { name: 'username', check: mysqlTEXT },
    { name: 'password', check: mysqlTEXT },
    { name: 'groupId', check: mysqlINT }
  ]),
  (request, response, next) => {
    // Check if the user is taken
    DBcon.query(
      'SELECT `username` FROM `TL_users` WHERE `username`=?',
      [request.body.username],
      handleQuery(next, (result) => {
        if (result.length > 0) {
          // Username is taken
          const error: ServerError = new Error('Username has been taken')
          error.status = 400
          error.code = 'trackless.user.usernameTaken'
          next(error)
        } else {
          // Create a new user
          // Store the password
          const [salt, hash] = storePassword(request.body.password)

          // Commit to the database
          DBcon.query(
            'INSERT INTO `TL_users` ( `firstname`, `lastname`, `username`, `groupId`, `salt_hash`, `hash` ) VALUES ( ?, ?, ?, ?, ?, ?)',
            [
              request.body.firstname,
              request.body.lastname,
              request.body.username,
              Number(request.body.groupId),
              salt,
              hash
            ],
            handleQuery(next, (result) => {
              response.status(201).json({
                userId: result.insertId
              })
            })
          )
        }
      })
    )
  }
)

router.use(userIdRouter)

router.use(unusedRequestTypes())

export default router
