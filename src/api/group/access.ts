// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/authHandler'
import groupIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/groupIDCheckHandler'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import { mysqlTEXT } from '../../scripts/types'

const router = express.Router()

// List all access rules for a group
router.get(
  '/:groupID/access',
  authHandler('trackless.access.readAll'),
  groupIDCheckHandler(),
  (request, response, next) => {
    DBcon.query(
      'SELECT `accessID`, `access` FROM `TL_access` WHERE `groupID`=?',
      [request.params.groupID],
      handleQuery(next, (result) => {
        response.status(200).json(result)
      })
    )
  }
)

// Add a new access rule for a group
router.post(
  '/:groupID/access',
  authHandler('trackless.access.create'),
  requireHandler([
    { name: 'access', check: mysqlTEXT }
  ]),
  groupIDCheckHandler(),
  (request, response, next) => {
    // Save it to the database
    DBcon.query(
      'INSERT INTO `TL_access` (`groupID`, `access`) VALUES (?,?)',
      [
        request.params.groupID,
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

export default router
