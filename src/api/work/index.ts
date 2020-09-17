// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import { mysqlINT, mysqlDATE, mysqlTEXT } from '../../scripts/types'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import userRoute from './user'
import settingsHandler from '../../scripts/RequestHandler/settingsHandler'
import moment from 'moment'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'

const router = express.Router()

router.post(
  '/',
  authHandler('trackless.work.create'),
  requireHandler([
    { name: 'locationId', check: mysqlINT },
    { name: 'worktypeId', check: mysqlINT },
    { name: 'time', check: mysqlINT },
    { name: 'date', check: mysqlDATE },
    { name: 'description', check: mysqlTEXT }
  ]),
  settingsHandler(),
  (request, response, next) => {
    const saveWork = () => {
      // Push the new work to the server
      DBcon.query(
        'INSERT INTO `TL_work` (`userId`, `locationId`, `worktypeId`, `time`, `date`, `description`) VALUES (?,?,?,?,?,?)',
        [
          request.user?.userId,
          request.body.locationId,
          request.body.worktypeId,
          request.body.time,
          request.body.date,
          request.body.description
        ],
        handleQuery(next, (result) => {
          // Response with the new id
          response.status(201).json({
            workId: result.insertId
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

router.use('/user', userRoute)

router.use(unusedRequestTypes())

export default router
