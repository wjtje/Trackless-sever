// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import { mysqlINT, mysqlDATE, mysqlFLOAT, mysqlUTFTEXT } from '../../scripts/types'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import settingsHandler from '../../scripts/RequestHandler/settingsHandler'
import moment from 'moment'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'
import sortHandler from '../../scripts/RequestHandler/sortHandler'
import { responseWork, TLWork } from '../../scripts/responseWork'
import workIDRoute from './workID'
import { encodeText } from '../../scripts/testEncoding'

const router = express.Router()

router.get(
  '/',
  authHandler('trackless.work.readAll'),
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
      sort += ` AND \`date\` <= '${moment(String(request.query.endDate), 'YYYY-MM-DD').format('YYYY-MM-DD')}' `
    }

    // Get all the work for that user
    DBcon.query(
      'SELECT * FROM `TL_vWork` WHERE 1=1 ' + sort + String((request.querySort || ' ORDER BY `date`')),
      [(request.params.userID === '~') ? request.user?.userID : request.params.userID],
      handleQuery(next, (result:Array<TLWork>) => {
        responseWork(result, response)
      })
    )
  }
)

router.post(
  '/',
  authHandler('trackless.work.createAll'),
  requireHandler([
    { name: 'locationID', check: mysqlINT },
    { name: 'worktypeID', check: mysqlINT },
    { name: 'userID', check: mysqlINT },
    { name: 'time', check: mysqlFLOAT },
    { name: 'date', check: mysqlDATE },
    { name: 'description', check: mysqlUTFTEXT }
  ]),
  settingsHandler(),
  (request, response, next) => {
    const saveWork = () => {
      // Push the new work to the server
      DBcon.query(
        'INSERT INTO `TL_work` (`userID`, `locationID`, `worktypeID`, `time`, `date`, `description`) VALUES (?,?,?,?,?,?)',
        [
          request.body.userID,
          request.body.locationID,
          request.body.worktypeID,
          request.body.time,
          request.body.date,
          encodeText(request.body.description)
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

router.use('/', workIDRoute)

router.use(unusedRequestTypes())

export default router
