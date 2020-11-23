// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/authHandler'
import checkLateWork from '../../scripts/RequestHandler/checkLateWork'
import workIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/workIDCheckHandler'
import { patchHandler, handlePatchQuery } from '../../scripts/RequestHandler/patchHandler'
import settingsHandler from '../../scripts/RequestHandler/settingsHandler'
import { TLWork, responseWork } from '../../scripts/responseWork'
import { encodeText } from '../../scripts/testEncoding'
import { mysqlINT, mysqlDATE, mysqlUTFTEXT, mysqlFLOAT } from '../../scripts/types'

const router = express.Router()

// Get a work object
router.get(
  '/:workID',
  authHandler('trackless.work.readAll'),
  workIDCheckHandler(),
  (request, response, next) => {
    // Get the work from the server
    DBcon.query(
      'SELECT * FROM `TL_vWork` WHERE `workID`=?',
      [request.params.workID],
      handleQuery(next, (result:Array<TLWork>) => {
        responseWork(result, response)
      })
    )
  }
)

// Edit a work object
router.patch(
  '/:workID',
  authHandler('trackless.work.editAll'),
  workIDCheckHandler(),
  settingsHandler(),
  checkLateWork(),
  patchHandler([
    { name: 'locationID', check: mysqlINT },
    { name: 'date', check: mysqlDATE },
    { name: 'time', check: mysqlFLOAT },
    { name: 'description', check: mysqlUTFTEXT },
    { name: 'worktypeID', check: mysqlINT },
    { name: 'userID', check: mysqlINT }
  ], (resolve, reject, key, request) => {
    let body = request.body[key]

    if (key === 'description') {
      body = encodeText(request.body[key])
    }

    DBcon.query(
      'UPDATE `TL_work` SET `' + key + '`=? WHERE `workID`=?',
      [
        body,
        request.params.workID
      ],
      handlePatchQuery(reject, resolve)
    )
  })
)

// Remove a work object
router.delete(
  '/:workID',
  authHandler('trackless.work.removeAll'),
  workIDCheckHandler(),
  settingsHandler(),
  checkLateWork(),
  (request, response, next) => {
    DBcon.query(
      'DELETE FROM `TL_work` WHERE `workID`=?',
      [
        request.params.workID
      ],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'done'
        })
      })
    )
  }
)

export default router
