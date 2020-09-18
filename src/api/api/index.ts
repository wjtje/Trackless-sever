// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import apiIDRoute from './apiID'
import sortHandler from '../../scripts/RequestHandler/sortHandler'

const router = express.Router()

// Get all your active api keys
router.get(
  '/',
  authHandler('trackless.api.read'),
  sortHandler([
    'apiID',
    'createDate',
    'lastUsed',
    'deviceName'
  ]),
  (request, response, next) => {
    // Get all the api keys from the server
    DBcon.query(
      'SELECT `apiID`, `createDate`, `lastUsed`, `deviceName` FROM `TL_apikeys` WHERE `userID`=?' + String(response.locals.sort || ''),
      [request.user?.userID],
      handleQuery(next, (result) => {
        // Send the data back to the user
        response.status(200).json(result)
      })
    )
  }
)

router.use('/', apiIDRoute)

router.use(unusedRequestTypes())

export default router
