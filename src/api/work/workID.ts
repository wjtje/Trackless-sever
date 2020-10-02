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
import { mysqlINT, mysqlDATE, mysqlTEXT } from '../../scripts/types'

const router = express.Router()

// Get a work object
router.get(
  '/:workID',
  authHandler('trackless.work.readAll'),
  workIDCheckHandler(),
  (request, response, next) => {
    // Get the work from the server
    DBcon.query(
      'SELECT workID, `time`, `date`, description, TL_users.userID as `user.userID`, TL_users.firstname as `user.firstname`, TL_users.lastname as `user.lastname`, TL_users.username as `user.username`, TL_groups.groupID as `user.groupID`, TL_groups.groupName as `user.groupName`, TL_locations.locationID as `location.locationID`, TL_locations.place as `location.place`, TL_locations.name as `location.name`, TL_locations.id as `location.id`, TL_worktype.worktypeID as `worktype.worktypeID`, TL_worktype.name as `worktype.name` FROM `TL_work` INNER JOIN `TL_users` USING (`userID`) INNER JOIN `TL_locations` USING (`locationID`) INNER JOIN `TL_worktype` USING (`worktypeID`) INNER JOIN `TL_groups` USING (`groupID`) WHERE `workID`=?',
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
    { name: 'time', check: mysqlINT },
    { name: 'description', check: mysqlTEXT },
    { name: 'worktypeID', check: mysqlINT },
    { name: 'userID', check: mysqlINT }
  ], (resolve, reject, key, request) => {
    DBcon.query(
      'UPDATE `TL_work` SET `' + key + '`=? WHERE `workID`=?',
      [
        request.body[key],
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
