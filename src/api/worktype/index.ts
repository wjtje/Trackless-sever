// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import { mysqlTEXT } from '../../scripts/types'
import sortHandler from '../../scripts/RequestHandler/sortHandler'
import worktypeIDRouter from './worktypeID'

const router = express.Router()

// Get all the users from the system
router.get(
  '/',
  authHandler('trackless.worktype.read'),
  sortHandler([
    'worktypeID',
    'name'
  ]),
  (request, response, next) => {
    // Send the request
    DBcon.query(
      'SELECT `worktypeID`, `name` FROM `TL_worktype` ' + String((response.locals.sort || ' ORDER BY `name`')),
      handleQuery(next, (result) => {
        response.status(200).json(result)
      })
    )
  }
)

// Create a new user
router.post(
  '/',
  authHandler('trackless.worktype.create'),
  requireHandler([
    { name: 'name', check: mysqlTEXT }
  ]),
  (request, response, next) => {
    DBcon.query(
      'INSERT INTO `TL_worktype` ( `name` ) VALUES ( ? )',
      [
        request.body.name
      ],
      handleQuery(next, (result) => {
        response.status(201).json({
          worktypeID: result.insertId
        })
      })
    )
  }
)

router.use('/', worktypeIDRouter)

router.use(unusedRequestTypes())

export default router
