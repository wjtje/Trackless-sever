// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import moment from 'moment'
import _ from 'lodash'

const router = express.Router()

// Get last used
router.get(
  '/:userID/last',
  authHandler('trackless.location.read'),
  (request, response, next) => {
    // Get last locationID from the server
    DBcon.query(
      'SELECT `locationID`, `name`, `place`, `id` FROM `TL_work` INNER JOIN `TL_locations` USING (`locationID`) WHERE `userID`=? AND `hidden`=0 ORDER BY `workID` DESC LIMIT 1',
      [(request.params.userID === '~') ? request.user?.userID : request.params.userID],
      handleQuery(next, (result) => {
        response.status(200).json(result)
      })
    )
  }
)

// Get most used
router.get(
  '/:userID/most',
  authHandler('trackless.location.read'),
  (request, response, next) => {
    // Get the last two
    DBcon.query(
      'SELECT * FROM `TL_locations` WHERE `hidden`=0 ORDER BY `locationID` DESC LIMIT 2',
      handleQuery(next, (randomLocations) => {
        // Get most used locationID from the server (limit 2)
        DBcon.query(
          'SELECT `locationID`, `name`, `place`, `id`, `hidden`, COUNT(`locationID`) as `occurrence` FROM `TL_work` INNER JOIN `TL_locations` USING (`locationID`) WHERE `userID` = ? AND `hidden`=0 AND `date` >= ? AND `date` <= ? GROUP BY `locationID` ORDER BY `occurrence` DESC LIMIT 2',
          [
            request.user?.userID,
            moment().subtract(7, 'days').format('YYYY-MM-DD'), // Last week
            moment().format('YYYY-MM-DD') // Now
          ],
          handleQuery(next, (result) => {
            // Return to the user
            response.status(200).json([
              _.get(result, '[0]', randomLocations[0]),
              _.get(result, '[1]', randomLocations[1])
            ])
          })
        )
      })
    )
  }
)

router.use(unusedRequestTypes())

export default router
