// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import accessIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/accessIDCheckHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'

const router = express.Router()

router.get(
  '/:accessID',
  authHandler('trackless.access.readAll'),
  accessIDCheckHandler(),
  (request, response, next) => {
    // Get the data from the server
    DBcon.query(
      'SELECT `accessID`, `access`, `groupID` FROM `TL_access` WHERE `accessID`=?',
      [request.params?.accessID],
      handleQuery(next, (result) => {
        response.status(200).json(result)
      })
    )
  }
)

router.delete(
  '/:accessID',
  authHandler('trackless.access.remove'),
  accessIDCheckHandler(),
  (request, response, next) => {
    // Remove from the server
    DBcon.query(
      'DELETE FROM `TL_access` WHERE `accessID`=?',
      [request.params.accessID],
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
