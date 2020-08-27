// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import accessIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/accessIdCheckHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'

const router = express.Router()

router.get(
  '/:accessId',
  authHandler('trackless.access.read'),
  accessIdCheckHandler(),
  (request, response, next) => {
    // Get the data from the server
    DBcon.query(
      'SELECT `accessId`, `access` FROM `TL_access` WHERE `accessId`=?',
      [request.params?.accessId],
      handleQuery(next, (result) => {
        response.status(200).json(result)
      })
    )
  }
)

router.delete(
  '/:accessId',
  authHandler('trackless.access.remove'),
  accessIdCheckHandler(),
  (request, response, next) => {
    // Remove from the server
    DBcon.query(
      'DELETE FROM `TL_access` WHERE `accessId`=?',
      [request.params.accessId],
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
