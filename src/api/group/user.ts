// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/authHandler'
import groupIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/groupIDCheckHandler'
import sortHandler from '../../scripts/RequestHandler/sortHandler'

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
  (request, response, next) => {
    // Get all the infomation we need
    DBcon.query(
      'SELECT `userID`, `firstname`, `lastname`, `username`, `groupID`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`groupID`) WHERE `groupID`=?' + String(response.locals.sort || 'ORDER BY `firstname`, `lastname`, `username`'),
      [request.params.groupID],
      handleQuery(next, (result) => {
        // Return the infomation
        response.status(200).json(result)
      })
    )
  }
)

export default router
