// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import apiIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/apiIDCheckHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'

const router = express.Router()

// Get infomation about a single api key
router.get(
  '/:apiID',
  authHandler('trackless.api.read'),
  apiIDCheckHandler(),
  (request, response, next) => {
    // Get the data from the server
    DBcon.query(
      'SELECT `apiID`, `createDate`, `lastUsed`, `deviceName` FROM `TL_apikeys` WHERE `userID`=? AND `apiID`=?',
      [request.user?.userID, request.params.apiID],
      handleQuery(next, (result) => {
        // Send the data back to the user
        response.status(200).json(result)
      })
    )
  }
)

// Remove a single api key
router.delete(
  '/:apiID',
  authHandler('trackless.api.remove'),
  apiIDCheckHandler(),
  (request, response, next) => {
    // Send the command to the server
    DBcon.query(
      'DELETE FROM `TL_apikeys` WHERE `apiID`=? and `userID`=?',
      [request.params.apiID, request.user?.userID],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'done'
        })
      })
    )
  }
)

router.use(unusedRequestTypes())

export default router
