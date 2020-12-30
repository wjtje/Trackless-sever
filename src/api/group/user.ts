// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/authHandler'
import groupIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/groupIDCheckHandler'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIDCheckHandler'
import limitOffsetHandler from '../../scripts/RequestHandler/limitOffsetHandler'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import sortHandler from '../../scripts/RequestHandler/sortHandler'
import { mysqlINT } from '../../scripts/types'

const router = express.Router()

// Get all the users in a group
router.get(
  '/:groupID/user',
  authHandler('trackless.group.read'),
  groupIDCheckHandler(),
  sortHandler([
    'userID',
    'firstname',
    'lastname',
    'username',
    'groupID',
    'groupName'
  ]),
  limitOffsetHandler(),
  (request, response, next) => {
    // Get all the infomation we need
    DBcon.query(
      'SELECT `userID`, `firstname`, `lastname`, `username`, `groupID`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`groupID`) WHERE `groupID`=?' + `${request.querySort ?? 'ORDER BY `firstname`, `lastname`, `username`'} ${request.queryLimitOffset ?? ''}`,
      [request.params.groupID],
      handleQuery(next, (result) => {
        // Return the infomation
        response.status(200).json(result)
      })
    )
  }
)

// Add a user to a group
router.post(
  '/:groupID/user',
  authHandler('trackless.group.add'),
  groupIDCheckHandler(),
  requireHandler([
    { name: 'userID', check: mysqlINT }
  ]),
  userIDCheckHandler(request => request.body.userID),
  (request, response, next) => {
    // Change it in the database
    DBcon.query(
      'UPDATE `TL_users` SET `groupID`=? WHERE `userID`=?',
      [
        request.params.groupID,
        request.body.userID
      ],
      handleQuery(next, () => {
        response.status(201).json({
          message: 'Updated'
        })
      })
    )
  }
)

export default router
