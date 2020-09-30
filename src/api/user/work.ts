// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import moment from 'moment'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/authHandler'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIDCheckHandler'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'
import settingsHandler from '../../scripts/RequestHandler/settingsHandler'
import sortHandler from '../../scripts/RequestHandler/sortHandler'
import { responseWork, TLWork } from '../../scripts/responseWork'
import { mysqlINT, mysqlDATE, mysqlTEXT, mysqlFLOAT } from '../../scripts/types'

const router = express.Router()

router.get(
  '/:userID/work',
  authHandler(request => (request.params.userID === '~') ? 'trackless.work.readOwn' : 'trackless.work.readAll'),
  userIDCheckHandler(),
  sortHandler([
    'workID',
    'time',
    'date',
    'description',
    'user.userID',
    'user.firstname',
    'user.lastname',
    'user.username',
    'user.groupID',
    'user.groupName',
    'location.locationID',
    'location.place',
    'location.name',
    'location.id',
    'worktype.worktypeID',
    'worktype.name'
  ]),
  (request, response, next) => {
    // Check if the startDate and / or endDate is correct
    let sort = ''

    if (moment(String(request.query.startDate), 'YYYY-MM-DD').isValid()) {
      sort += ` AND \`date\` >= '${moment(String(request.query.startDate), 'YYYY-MM-DD').format('YYYY-MM-DD')}' `
    }

    if (moment(String(request.query.endDate), 'YYYY-MM-DD').isValid()) {
      sort += ` AND \`date\` <= '${moment(String(request.query.startDate), 'YYYY-MM-DD').format('YYYY-MM-DD')}' `
    }

    // Get all the work for that user
    DBcon.query(
      'SELECT workID, `time`, `date`, description, TL_users.userID as `user.userID`, TL_users.firstname as `user.firstname`, TL_users.lastname as `user.lastname`, TL_users.username as `user.username`, TL_groups.groupID as `user.groupID`, TL_groups.groupName as `user.groupName`, TL_locations.locationID as `location.locationID`, TL_locations.place as `location.place`, TL_locations.name as `location.name`, TL_locations.id as `location.id`, TL_worktype.worktypeID as `worktype.worktypeID`, TL_worktype.name as `worktype.name` FROM `TL_work` INNER JOIN `TL_users` USING (`userID`) INNER JOIN `TL_locations` USING (`locationID`) INNER JOIN `TL_worktype` USING (`worktypeID`) INNER JOIN `TL_groups` USING (`groupID`) WHERE `userID`=? ' + sort + String((request.querySort || ' ORDER BY `date`')),
      [(request.params.userID === '~') ? request.user?.userID : request.params.userID],
      handleQuery(next, (result:Array<TLWork>) => {
        responseWork(result, response)
      })
    )
  }
)

router.post(
  '/:userID/work',
  authHandler(request => (request.params.userID === '~') ? 'trackless.work.createOwn' : 'trackles..work.createAll'),
  userIDCheckHandler(),
  requireHandler([
    { name: 'locationID', check: mysqlINT },
    { name: 'worktypeID', check: mysqlINT },
    { name: 'time', check: mysqlFLOAT },
    { name: 'date', check: mysqlDATE },
    { name: 'description', check: mysqlTEXT }
  ]),
  settingsHandler(),
  (request, response, next) => {
    const saveWork = () => {
      // Push the new work to the server
      DBcon.query(
        'INSERT INTO `TL_work` (`userID`, `locationID`, `worktypeID`, `time`, `date`, `description`) VALUES (?,?,?,?,?,?)',
        [
          (request.params.userID === '~') ? request.user?.userID : request.params.userID,
          request.body.locationID,
          request.body.worktypeID,
          request.body.time,
          request.body.date,
          request.body.description
        ],
        handleQuery(next, (result) => {
          // Response with the new id
          response.status(201).json({
            workID: result.insertId
          })
        })
      )
    }

    // Check if the user is allowed to add work
    if (response.locals.setting?.workLateDays == null) {
      saveWork()
    } else if (moment(request.body.date).isAfter(moment().subtract(Number(response.locals.setting.workLateDays), 'days'))) {
      saveWork()
    } else {
      const error: ServerError = new Error('You are not allowed to save work')
      error.code = 'trackless.work.toLate'
      error.status = 400
      next(error)
    }
  }
)

export default router
