// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIDCheckHandler'
import authHandler from '../../scripts/RequestHandler/authHandler'
import { handleQuery } from '../../scripts/handle'
import { responseWork, TLWork } from './script'
import { DBcon } from '../..'
import workIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/workIDCheckHandler'
import { patchHandler, handlePatchQuery } from '../../scripts/RequestHandler/patchHandler'
import { mysqlINT, mysqlTEXT, mysqlDATE } from '../../scripts/types'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'
import settingsHandler from '../../scripts/RequestHandler/settingsHandler'
import checkLateWork from './checkLateWork'

const router = express.Router()

// Get all the work for a user
router.get(
  '/:userID',
  authHandler((request) => {
    if (request.params.userID === '~') {
      return 'trackless.work.readOwn'
    } else {
      return 'trackless.work.readAll'
    }
  }),
  userIDCheckHandler(),
  (request, response, next) => {
    // Get all the work for that user
    DBcon.query(
      'SELECT `workID`, `userID`, `locationID`, `groupID`, `time`, `date`, `description`, `TL_locations`.`name`, `place`, `id`, `firstname`, `lastname`, `username`, `groupName`, `worktypeID`, `TL_worktype`.`name` as `wname` FROM `TL_work` INNER JOIN `TL_users` USING (`userID`) INNER JOIN `TL_locations` USING (`locationID`) INNER JOIN `TL_worktype` USING (`worktypeID`) INNER JOIN `TL_groups` USING (`groupID`) WHERE `userID`=? ORDER BY `date`',
      [(request.params.userID === '~') ? request.user?.userID : request.params.userID],
      handleQuery(next, (result:Array<TLWork>) => {
        responseWork(result, response)
      })
    )
  }
)

// Get all the work for a user in a time span
router.get(
  '/:userID/date/:start/:end',
  authHandler((request) => {
    if (request.params.userID === '~') {
      return 'trackless.work.readOwn'
    } else {
      return 'trackless.work.readAll'
    }
  }),
  userIDCheckHandler(),
  (request, response, next) => {
    // Get all the work for that user
    DBcon.query(
      'SELECT `workID`, `userID`, `locationID`, `groupID`, `time`, `date`, `description`, `TL_locations`.`name`, `place`, `id`, `firstname`, `lastname`, `username`, `groupName`, `worktypeID`, `TL_worktype`.`name` as `wname` FROM `TL_work` INNER JOIN `TL_users` USING (`userID`) INNER JOIN `TL_locations` USING (`locationID`) INNER JOIN `TL_groups` USING (`groupID`) INNER JOIN `TL_worktype` USING (`worktypeID`) WHERE `userID`=? AND `date` >= ? AND `date` <= ? ORDER BY `date`',
      [
        (request.params.userID === '~') ? request.user?.userID : request.params.userID,
        request.params.start,
        request.params.end
      ],
      handleQuery(next, (result:Array<TLWork>) => {
        responseWork(result, response)
      })
    )
  }
)

// Get a single work object from a user
router.get(
  '/:userID/:workID',
  authHandler((request) => {
    if (request.params.userID === '~') {
      return 'trackless.work.readOwn'
    } else {
      return 'trackless.work.readAll'
    }
  }),
  userIDCheckHandler(),
  workIDCheckHandler(),
  (request, response, next) => {
    // Get the data from the server and return it
    DBcon.query(
      'SELECT `workID`, `userID`, `locationID`, `groupID`, `time`, `date`, `description`, `TL_locations`.`name`, `place`, `id`, `firstname`, `lastname`, `username`, `groupName`, `worktypeID`, `TL_worktype`.`name` as `wname` FROM `TL_work` INNER JOIN `TL_users` USING (`userID`) INNER JOIN `TL_locations` USING (`locationID`) INNER JOIN `TL_groups` USING (`groupID`) INNER JOIN `TL_worktype` USING (`worktypeID`) WHERE `userID`=? AND `workID`=?',
      [
        (request.params.userID === '~') ? request.user?.userID : request.params.userID,
        request.params.workID
      ],
      handleQuery(next, (result:Array<TLWork>) => {
        responseWork(result, response)
      })
    )
  }
)

// Remove a single work object from a user
router.delete(
  '/:userID/:workID',
  authHandler((request) => {
    if (request.params.userID === '~') {
      return 'trackless.work.removeOwn'
    } else {
      return 'trackless.work.removeAll'
    }
  }),
  userIDCheckHandler(),
  workIDCheckHandler(),
  settingsHandler(),
  checkLateWork(),
  (request, response, next) => {
    // Get the data from the server and return it
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

// Edit a single work object from a user
router.patch(
  '/:userID/:workID',
  authHandler((request) => {
    if (request.params.userID === '~') {
      return 'trackless.work.editOwn'
    } else {
      return 'trackless.work.editAll'
    }
  }),
  userIDCheckHandler(),
  workIDCheckHandler(),
  settingsHandler(),
  checkLateWork(),
  patchHandler([
    { name: 'locationID', check: mysqlINT },
    { name: 'date', check: mysqlDATE },
    { name: 'time', check: mysqlINT },
    { name: 'description', check: mysqlTEXT },
    { name: 'worktypeID', check: mysqlINT }
  ], (resolve, reject, key, request) => {
    function changeWork () {
      DBcon.query(
        'UPDATE `TL_work` SET `' + key + '`=? WHERE `workID`=? AND `userID`=?',
        [
          request.body[key],
          request.params.workID,
          (request.params.userID === '~') ? request.user?.userID : request.params.userID
        ],
        handlePatchQuery(reject, resolve)
      )
    }

    if (key === 'locationID') {
      // Check if the location is valid
      DBcon.query(
        'SELECT `locationID` FROM `TL_locations` WHERE `locationID`=?',
        [request.body.locationID],
        (error, result) => {
          if (error || result.length === 0) {
            // Something wrong in the array
            const error: ServerError = new Error('Your location id is not valid')
            error.status = 400
            error.code = 'trackless.work.notValidlocationID'
            reject(error)
          } else {
            changeWork()
          }
        })
    } else {
      // Change it
      changeWork()
    }
  })
)

router.use(unusedRequestTypes)

export default router
