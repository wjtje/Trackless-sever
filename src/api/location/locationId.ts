// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import locationIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/locationIdCheckHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import { patchHandler, handlePatchQuery } from '../../scripts/RequestHandler/patchHandler'
import { mysqlTEXT, mysqlBOOLEAN } from '../../scripts/types'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'

const router = express.Router()

router.get(
  '/:locationId',
  authHandler('trackless.location.read'),
  locationIdCheckHandler(),
  (request, response, next) => {
    // Get the data from the server
    DBcon.query(
      'SELECT * FROM `TL_locations` WHERE `locationId`=?',
      [request.params.locationId],
      handleQuery(next, (result) => {
        response.status(200).json(result)
      })
    )
  }
)

router.delete(
  '/:locationId',
  authHandler('trackless.location.remove'),
  locationIdCheckHandler(),
  (request, response, next) => {
    // Delete from database
    DBcon.query(
      'DELETE FROM `TL_locations` WHERE `locationId`=?',
      [request.params.locationId],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'done'
        })
      }, () => {
        const error: ServerError = new Error('Location can not be removed')
        error.code = 'trackless.location.removeFailed'
        error.status = 409
        next(error)
      })
    )
  }
)

router.patch(
  '/:locationId',
  authHandler('trackless.location.edit'),
  locationIdCheckHandler(),
  patchHandler([
    { name: 'name', check: mysqlTEXT },
    { name: 'place', check: mysqlTEXT },
    { name: 'id', check: mysqlTEXT },
    { name: 'hidden', check: mysqlBOOLEAN }
  ], (resolve, reject, key, request) => {
    // Update the key
    DBcon.query(
      'UPDATE `TL_locations` SET `' + key + '`=? WHERE `locationId`=?',
      [request.body[key], request.params.locationId],
      handlePatchQuery(reject, resolve)
    )
  })
)

router.use(unusedRequestTypes)

export default router
