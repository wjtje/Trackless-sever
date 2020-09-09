// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import { patchHandler, handlePatchQuery } from '../../scripts/RequestHandler/patchHandler'
import { mysqlTEXT } from '../../scripts/types'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'
import worktypeIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/worktypeIdCheckHandler'

const router = express.Router()

// Get by worktypeId
router.get(
  '/:worktypeId',
  authHandler('trackless.worktype.read'),
  worktypeIdCheckHandler(),
  (request, response, next) => {
    // Get the data from the server
    DBcon.query(
      'SELECT `worktypeId`, `name` FROM `TL_worktype` WHERE `worktypeId`=?',
      [request.params.worktypeId],
      handleQuery(next, (result) => {
        // Send the result back
        response.status(200).json(result)
      })
    )
  }
)

// Remove a worktype
router.delete(
  '/:worktypeId',
  authHandler('trackless.worktype.remove'),
  worktypeIdCheckHandler(),
  (request, response, next) => {
    // Remove the user
    DBcon.query(
      'DELETE FROM `TL_worktype` WHERE `worktypeId`=?',
      [request.params.worktypeId],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'done'
        })
      }, () => {
        const error: ServerError = new Error('Worktype can not be removed')
        error.code = 'trackless.worktype.removeFailed'
        error.status = 409
        next(error)
      })
    )
  }
)

// Edit a worktype
router.patch(
  '/:worktypeId',
  authHandler('trackless.worktype.edit'),
  worktypeIdCheckHandler(),
  patchHandler(
    [
      { name: 'name', check: mysqlTEXT }
    ],
    (resolve, reject, key, request) => {
      DBcon.query(
        'UPDATE `TL_worktype` SET `' + key + '`=? WHERE `worktypeId`=?',
        [
          request.body[key],
          request.params.worktypeId
        ],
        handlePatchQuery(reject, resolve)
      )
    }
  )
)

router.use(unusedRequestTypes())

export default router
