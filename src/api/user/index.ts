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
import userIDRouter from './userID'
import sortHandler from '../../scripts/RequestHandler/sortHandler'
import workRoute from './work'
import workIDRoute from './workID'
import accessRoute from './access'

const router = express.Router()

// Get all the users from the system
router.get(
  '/',
  authHandler('trackless.user.readAll'),
  sortHandler([
    'userID',
    'firstname',
    'lastname',
    'username',
    'groupID',
    'groupName'
  ]),
  (request, response, next) => {
    // Send the request
    DBcon.query(
      'SELECT `userID`, `firstname`, `lastname`, `username`, `groupID`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`groupID`) ' + String((request.querySort || ' ORDER BY `firstname`, `lastname`, `username`')),
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
    { name: 'groupID', check: mysqlINT }
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
            'INSERT INTO `TL_users` ( `firstname`, `lastname`, `username`, `groupID`, `salt_hash`, `hash` ) VALUES ( ?, ?, ?, ?, ?, ?)',
            [
              request.body.firstname,
              request.body.lastname,
              request.body.username,
              Number(request.body.groupID),
              salt,
              hash
            ],
            handleQuery(next, (result) => {
              response.status(201).json({
                userID: result.insertId
              })
            })
          )
        }
      })
    )
  }
)

router.use(userIDRouter)
router.use(workRoute)
router.use(workIDRoute)
router.use(accessRoute)

router.use(unusedRequestTypes())

export default router
