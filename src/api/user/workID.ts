// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/authHandler'
import checkLateWork from '../../scripts/RequestHandler/checkLateWork'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIDCheckHandler'
import workIDuserIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/workIDuserIDCheckHandler'
import { patchHandler, handlePatchQuery } from '../../scripts/RequestHandler/patchHandler'
import settingsHandler from '../../scripts/RequestHandler/settingsHandler'
import { TLWork, responseWork } from '../../scripts/responseWork'
import { encodeText } from '../../scripts/testEncoding'
import { mysqlINT, mysqlDATE, mysqlUTFTEXT } from '../../scripts/types'

const router = express.Router()

// Get a work object
router.get(
  '/:userID/work/:workID',
  authHandler(request => (request.params.userID === '~') ? 'trackless.work.readOwn' : 'trackless.work.readAll'),
  userIDCheckHandler(),
  workIDuserIDCheckHandler(),
  (request, response, next) => {
    // Get the work from the server
    DBcon.query(
      'SELECT * FROM `TL_vWork` WHERE `user.userID`=? AND `workID`=?',
      [(request.params.userID === '~') ? request.user?.userID : request.params.userID, request.params.workID],
      handleQuery(next, (result:Array<TLWork>) => {
        responseWork(result, response)
      })
    )
  }
)

// Edit a work object
router.patch(
  '/:userID/work/:workID',
  authHandler(request => (request.params.userID === '~') ? 'trackless.work.editOwn' : 'trackless.work.editAll'),
  userIDCheckHandler(),
  workIDuserIDCheckHandler(),
  settingsHandler(),
  checkLateWork(),
  patchHandler([
    { name: 'locationID', check: mysqlINT },
    { name: 'date', check: mysqlDATE },
    { name: 'time', check: mysqlINT },
    { name: 'description', check: mysqlUTFTEXT },
    { name: 'worktypeID', check: mysqlINT }
  ], (resolve, reject, key, request) => {
    let body = request.body[key]

    if (key === 'description') {
      body = encodeText(request.body[key])
    }

    DBcon.query(
      'UPDATE `TL_work` SET `' + key + '`=? WHERE `workID`=? AND `userID`=?',
      [
        body,
        request.params.workID,
        (request.params.userID === '~') ? request.user?.userID : request.params.userID
      ],
      handlePatchQuery(reject, resolve)
    )
  })
)

// Remove a work object
router.delete(
  '/:userID/work/:workID',
  authHandler(request => (request.params.userID === '~') ? 'trackless.work.removeOwn' : 'trackless.work.removeAll'),
  userIDCheckHandler(),
  workIDuserIDCheckHandler(),
  settingsHandler(),
  checkLateWork(),
  (request, response, next) => {
    DBcon.query(
      'DELETE FROM `TL_work` WHERE `userID`=? AND `workID`=?',
      [
        (request.params.userID === '~') ? request.user?.userID : request.params.userID,
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
