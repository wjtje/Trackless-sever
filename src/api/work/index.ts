// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import { mysqlINT, mysqlDATE, mysqlTEXT } from '../../scripts/types'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import userRoute from './user'

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
  (request, response, next) => {
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
)

router.use('/user', userRoute)

router.use(unusedRequestTypes())

export default router
