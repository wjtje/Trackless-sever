// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import _ from 'lodash'
import moment from 'moment'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/authHandler'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIDCheckHandler'

const router = express.Router()

router.get(
  '/:userID/location',
  authHandler((request) => {
    if (request.params.userID === '~') {
      return 'trackless.location.readOwn'
    } else {
      return 'trackless.location.readAll'
    }
  }),
  userIDCheckHandler(),
  (request, response, next) => {
    // It is by desing that this does not return a total used time
    // Get the last used
    DBcon.query(
      'SELECT `locationID`, `name`, `place`, `id` FROM `TL_work` INNER JOIN `TL_locations` USING (`locationID`) WHERE `userID`=? AND `hidden`=0 ORDER BY `workID` DESC LIMIT 1',
      [(request.params.userID === '~') ? request.user?.userID : request.params.userID],
      handleQuery(next, (lastUsed) => {
        // Get two 'random' locations
        DBcon.query(
          'SELECT * FROM `TL_locations` WHERE `hidden`=0 ORDER BY `locationID` DESC LIMIT 2',
          handleQuery(next, (randomLocations) => {
            // Get most used locationID from the server (limit 2)
            DBcon.query(
              'SELECT `locationID`, `name`, `place`, `id`, `hidden`, COUNT(`locationID`) as `occurrence` FROM `TL_work` INNER JOIN `TL_locations` USING (`locationID`) WHERE `userID` = ? AND `hidden`=0 AND `date` >= ? AND `date` <= ? GROUP BY `locationID` ORDER BY `occurrence` DESC LIMIT 2',
              [
                (request.params.userID === '~') ? request.user?.userID : request.params.userID,
                moment().subtract(7, 'days').format('YYYY-MM-DD'), // Last week
                moment().format('YYYY-MM-DD') // Now
              ],
              handleQuery(next, (mostUsed) => {
                // Return to the user
                response.status(200).json({
                  last: lastUsed,
                  most: [
                    _.get(mostUsed, '[0]', randomLocations[0]),
                    _.get(mostUsed, '[1]', randomLocations[1])
                  ]
                })
              })
            )
          })
        )
      })
    )
  }
)

export default router
