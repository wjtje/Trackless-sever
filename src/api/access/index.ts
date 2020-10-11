// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import { mysqlINT, mysqlTEXT } from '../../scripts/types'
import accessIDRoute from './accessID'
import sortHandler from '../../scripts/RequestHandler/sortHandler'
import groupIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/groupIDCheckHandler'

const router = express.Router()

// Get your access
router.get(
  '/',
  authHandler('trackless.access.readAll'),
  sortHandler([
    'groupID',
    'accessID',
    'access'
  ]),
  (request, response, next) => {
    // Get all the data from the server
    DBcon.query(
      'SELECT `accessID`, `access`, `groupID` FROM `TL_access`' + String(request.querySort || ''),
      handleQuery(next, (result) => {
        response.status(200).json(result)
      })
    )
  }
)

// Give someone access
router.post(
  '/',
  authHandler('trackless.access.create'),
  requireHandler([
    { name: 'groupID', check: mysqlINT },
    { name: 'access', check: mysqlTEXT }
  ]),
  groupIDCheckHandler(request => request.body.groupID),
  (request, response, next) => {
    // Save it to the database
    DBcon.query(
      'INSERT INTO `TL_access` (`groupID`, `access`) VALUES (?,?)',
      [
        request.body.groupID,
        request.body.access
      ],
      handleQuery(next, (result) => {
        response.status(201).json({
          accessID: result.insertId
        })
      })
    )
  }
)

router.use('/', accessIDRoute)

router.use(unusedRequestTypes())

export default router
