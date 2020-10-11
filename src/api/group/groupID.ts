// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import authHandler from '../../scripts/RequestHandler/authHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import groupIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/groupIDCheckHandler'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import { mysqlTEXT } from '../../scripts/types'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'

const router = express.Router()

// Return a single group
router.get(
  '/:groupID',
  authHandler('trackless.group.read'),
  groupIDCheckHandler(),
  (request, response, next) => {
    // groupID is valid return the info
    DBcon.query(
      'SELECT * FROM `TL_groups` WHERE `groupID`=?',
      [request.params.groupID],
      handleQuery(next, (resultGroup) => {
        // Get all users
        DBcon.query(
          'SELECT `userID`, `firstname`, `lastname`, `username`, `groupID`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`groupID`) WHERE `groupID`=? ORDER BY `firstname`, `lastname`, `username`',
          [request.params.groupID],
          handleQuery(next, (resultUsers) => {
            // Return the infomation
            response.status(200).json([{
              groupID: request.params.groupID,
              groupName: resultGroup[0].groupName,
              users: resultUsers
            }])
          })
        )
      })
    )
  }
)

// Remove a single group
router.delete(
  '/:groupID',
  authHandler('trackless.group.remove'),
  groupIDCheckHandler(),
  (request, response, next) => {
    // groupID is valid remove it
    DBcon.query(
      'DELETE FROM `TL_groups` WHERE `groupID`=?',
      [request.params.groupID],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'Removed'
        })
      }, () => {
        const error: ServerError = new Error('Group can not be removed')
        error.code = 'trackless.group.removeFailed'
        error.status = 409
        next(error)
      })
    )
  }
)

// Edits a group name
router.patch(
  '/:groupID',
  authHandler('trackless.group.edit'),
  requireHandler([
    { name: 'groupName', check: mysqlTEXT }
  ]),
  groupIDCheckHandler(),
  (request, response, next) => {
    // groupID is valid edit it
    DBcon.query(
      'UPDATE `TL_groups` SET `groupName`=? WHERE `groupID`=?',
      [
        request.body.groupName,
        request.params.groupID
      ],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'Updated'
        })
      })
    )
  }
)

export default router
