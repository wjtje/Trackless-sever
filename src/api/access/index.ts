// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'
import { mysqlINT, mysqlTEXT } from '../../scripts/types'
import groupRouter from './group'
import accessIDRoute from './accessID'
import sortHandler from '../../scripts/RequestHandler/sortHandler'

const router = express.Router()

// Get your access
router.get(
  '/',
  authHandler('trackless.access.read'),
  sortHandler([
    'accessID',
    'access'
  ]),
  (request, response, next) => {
    // Get all the data from the server
    DBcon.query(
      'SELECT `accessID`, `access` FROM `TL_access` WHERE `groupID`=?' + String(response.locals.sort || ''),
      [request.user?.groupID],
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
  (request, response, next) => {
    DBcon.query(
      'SELECT `groupID` FROM `TL_groups` WHERE `groupID`=?',
      [request.body.groupID],
      handleQuery(next, (result) => {
        if (result.length === 0) {
          // Group not found
          const error: ServerError = new Error('The group is not found')
          error.code = 'trackless.access.groupNotFound'
          error.status = 400
          next(error)
        } else {
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
      })
    )
  }
)

router.use('/group', groupRouter)

router.use('/', accessIDRoute)

router.use(unusedRequestTypes())

export default router
