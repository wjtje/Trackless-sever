// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import userIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIdCheckHandler'
import authHandler from '../../scripts/RequestHandler/authHandler'
import { handleQuery } from '../../scripts/handle'
import { responseWork, TLWork } from './script'
import { DBcon } from '../..'
import workIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/workIdCheckHandler'
import { patchHandler, handlePatchQuery } from '../../scripts/RequestHandler/patchHandler'
import { mysqlINT, mysqlTEXT, mysqlDATE } from '../../scripts/types'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'
import settingsHandler from '../../scripts/RequestHandler/settingsHandler'
import checkLateWork from './checkLateWork'

const router = express.Router()

// Get all the work for a user
router.get(
  '/:userId',
  authHandler((request) => {
    if (request.params.userId === '~') {
      return 'trackless.work.readOwn'
    } else {
      return 'trackless.work.readAll'
    }
  }),
  userIdCheckHandler(),
  (request, response, next) => {
    // Get all the work for that user
    DBcon.query(
      'SELECT `workId`, `userId`, `locationId`, `groupId`, `time`, `date`, `description`, `TL_locations`.`name`, `place`, `id`, `firstname`, `lastname`, `username`, `groupName`, `worktypeId`, `TL_worktype`.`name` as `wname` FROM `TL_work` INNER JOIN `TL_users` USING (`userId`) INNER JOIN `TL_locations` USING (`locationId`) INNER JOIN `TL_worktype` USING (`worktypeId`) INNER JOIN `TL_groups` USING (`groupId`) WHERE `userId`=? ORDER BY `date`',
      [(request.params.userId === '~') ? request.user?.userId : request.params.userId],
      handleQuery(next, (result:Array<TLWork>) => {
        responseWork(result, response)
      })
    )
  }
)

// Get all the work for a user in a time span
router.get(
  '/:userId/date/:start/:end',
  authHandler((request) => {
    if (request.params.userId === '~') {
      return 'trackless.work.readOwn'
    } else {
      return 'trackless.work.readAll'
    }
  }),
  userIdCheckHandler(),
  (request, response, next) => {
    // Get all the work for that user
    DBcon.query(
      'SELECT `workId`, `userId`, `locationId`, `groupId`, `time`, `date`, `description`, `TL_locations`.`name`, `place`, `id`, `firstname`, `lastname`, `username`, `groupName`, `worktypeId`, `TL_worktype`.`name` as `wname` FROM `TL_work` INNER JOIN `TL_users` USING (`userId`) INNER JOIN `TL_locations` USING (`locationId`) INNER JOIN `TL_groups` USING (`groupId`) INNER JOIN `TL_worktype` USING (`worktypeId`) WHERE `userId`=? AND `date` >= ? AND `date` <= ? ORDER BY `date`',
      [
        (request.params.userId === '~') ? request.user?.userId : request.params.userId,
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
  '/:userId/:workId',
  authHandler((request) => {
    if (request.params.userId === '~') {
      return 'trackless.work.readOwn'
    } else {
      return 'trackless.work.readAll'
    }
  }),
  userIdCheckHandler(),
  workIdCheckHandler(),
  (request, response, next) => {
    // Get the data from the server and return it
    DBcon.query(
      'SELECT `workId`, `userId`, `locationId`, `groupId`, `time`, `date`, `description`, `TL_locations`.`name`, `place`, `id`, `firstname`, `lastname`, `username`, `groupName`, `worktypeId`, `TL_worktype`.`name` as `wname` FROM `TL_work` INNER JOIN `TL_users` USING (`userId`) INNER JOIN `TL_locations` USING (`locationId`) INNER JOIN `TL_groups` USING (`groupId`) INNER JOIN `TL_worktype` USING (`worktypeId`) WHERE `userId`=? AND `workId`=?',
      [
        (request.params.userId === '~') ? request.user?.userId : request.params.userId,
        request.params.workId
      ],
      handleQuery(next, (result:Array<TLWork>) => {
        responseWork(result, response)
      })
    )
  }
)

// Remove a single work object from a user
router.delete(
  '/:userId/:workId',
  authHandler((request) => {
    if (request.params.userId === '~') {
      return 'trackless.work.removeOwn'
    } else {
      return 'trackless.work.removeAll'
    }
  }),
  userIdCheckHandler(),
  workIdCheckHandler(),
  settingsHandler(),
  checkLateWork(),
  (request, response, next) => {
    // Get the data from the server and return it
    DBcon.query(
      'DELETE FROM `TL_work` WHERE `userId`=? AND `workId`=?',
      [
        (request.params.userId === '~') ? request.user?.userId : request.params.userId,
        request.params.workId
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
  '/:userId/:workId',
  authHandler((request) => {
    if (request.params.userId === '~') {
      return 'trackless.work.editOwn'
    } else {
      return 'trackless.work.editAll'
    }
  }),
  userIdCheckHandler(),
  workIdCheckHandler(),
  settingsHandler(),
  checkLateWork(),
  patchHandler([
    { name: 'locationId', check: mysqlINT },
    { name: 'date', check: mysqlDATE },
    { name: 'time', check: mysqlINT },
    { name: 'description', check: mysqlTEXT },
    { name: 'worktypeId', check: mysqlINT }
  ], (resolve, reject, key, request) => {
    function changeWork () {
      DBcon.query(
        'UPDATE `TL_work` SET `' + key + '`=? WHERE `workId`=? AND `userId`=?',
        [
          request.body[key],
          request.params.workId,
          (request.params.userId === '~') ? request.user?.userId : request.params.userId
        ],
        handlePatchQuery(reject, resolve)
      )
    }

    if (key === 'locationId') {
      // Check if the location is valid
      DBcon.query(
        'SELECT `locationId` FROM `TL_locations` WHERE `locationId`=?',
        [request.body.locationId],
        (error, result) => {
          if (error || result.length === 0) {
            // Something wrong in the array
            const error: ServerError = new Error('Your location id is not valid')
            error.status = 400
            error.code = 'trackless.work.notValidLocationId'
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
