// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import { mysqlTEXT } from '../../scripts/types'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import { sha512_256 as sha512 } from 'js-sha512'
import _ from 'lodash'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'

const router = express.Router()

router.post(
  '/',
  requireHandler([
    { name: 'username', check: mysqlTEXT },
    { name: 'password', check: mysqlTEXT },
    { name: 'deviceName', check: mysqlTEXT }
  ]),
  (request, response, next) => {
    // Get the hash, salt and userId from the server
    DBcon.query(
      'SELECT `salt_hash`, `hash`, `userId` FROM `TL_users` WHERE `username`=?',
      [request.body.username],
      handleQuery(next, (result) => {
        // Check the password
        if (sha512(request.body.password + _.get(result, '[0].salt_hash', '')) === _.get(result, '[0].hash', '')) {
          // Password correct
          // Create an apiKey using time
          const apiKey:string = sha512(Date.now().toString())

          // Save it to the database
          DBcon.query(
            'INSERT INTO `TL_apikeys` (`apiKey`, `deviceName`, `userId`) VALUES (?,?,?)',
            [
              sha512(apiKey),
              request.body.deviceName,
              result[0].userId
            ],
            handleQuery(next, () => {
              response.status(200).json({
                bearer: apiKey
              })
            })
          )
        } else {
          // Password incorrect
          const error: ServerError = new Error('Incorrect username or password')
          error.code = 'trackless.login.badLogin'
          error.status = 400
          next(error)
        }
      })
    )
  }
)

router.use(unusedRequestTypes())

export default router
