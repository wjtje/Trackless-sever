// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import groupIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/groupIdCheckHandler'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import { mysqlTEXT } from '../../scripts/types'
import userIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIdCheckHandler'

const router = express.Router()

// Return a single group
router.get(
  '/:groupId',
  authHandler('trackless.group.readAll'),
  groupIdCheckHandler(),
  (request, response, next) => {
    // groupId is valid return the info
    DBcon.query(
      'SELECT * FROM `TL_groups` WHERE `groupId`=?',
      [request.params.groupId],
      handleQuery(next, (resultGroup) => {
        // Get all users
        DBcon.query(
          'SELECT `userId`, `firstname`, `lastname`, `username`, `groupId`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`groupId`) WHERE `groupId`=? ORDER BY `firstname`, `lastname`, `username`',
          [request.params.groupId],
          handleQuery(next, (resultUsers) => {
            // Return the infomation
            response.status(200).json([{
              groupId: request.params.groupId,
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
  '/:groupId',
  authHandler('trackless.group.remove'),
  groupIdCheckHandler(),
  (request, response, next) => {
    // groupId is valid remove it
    DBcon.query(
      'DELETE FROM `TL_groups` WHERE `groupId`=?',
      [request.params.groupId],
      handleQuery(next, () => {
        // Remove all the users from that group
        DBcon.query(
          'UPDATE `TL_users` SET `groupId`=0 WHERE `groupId`=?',
          [request.params.groupId]
        )

        // Remove all access rules
        DBcon.query(
          'DELETE FROM `TL_access` WHERE `groupId`=?',
          [request.params.groupId]
        )

        response.status(200).json({
          message: 'Removed'
        })
      })
    )
  }
)

// Edits a group name
router.patch(
  '/:groupId',
  authHandler('trackless.group.edit'),
  requireHandler([
    { name: 'groupName', check: mysqlTEXT }
  ]),
  groupIdCheckHandler(),
  (request, response, next) => {
    // groupId is valid edit it
    DBcon.query(
      'UPDATE `TL_groups` SET `groupName`=? WHERE `groupId`=?',
      [
        request.body.groupName,
        request.params.groupId
      ],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'Updated'
        })
      })
    )
  }
)

// Add a user to a group
router.post(
  '/:groupId/add/:userId',
  authHandler('trackless.group.add'),
  groupIdCheckHandler(),
  userIdCheckHandler(),
  (request, response, next) => {
    // Change it in the database
    DBcon.query(
      'UPDATE `TL_users` SET `groupId`=? WHERE `userId`=?',
      [
        request.params.groupId,
        request.params.userId
      ],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'Updated'
        })
      })
    )
  }
)

router.use(unusedRequestTypes())

export default router
