// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import _ from 'lodash'
import moment from 'moment'
import {DBcon} from '../..'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'
import {handleQuery} from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/user-id-check-handler'

const router = expressRouter()

router.get(
	'/:userID/location',
	getDatabaseConnection(),
	authHandler(request => {
		return request.params.userID === '~' ? 'trackless.location.readOwn' : 'trackless.location.readAll'
	}),
	userIDCheckHandler(),
	(request, response, next) => {
		// It is by desing that this does not return a total used time
		// Get the last used
		DBcon.query(
			'SELECT `locationID`, `name`, `place`, `id` FROM `TL_work` INNER JOIN `TL_locations` USING (`locationID`) WHERE `userID`=? AND `hidden`=0 ORDER BY `workID` DESC LIMIT 1',
			[(request.params.userID === '~') ? request.user?.userID : request.params.userID],
			handleQuery(next, lastUsed => {
				// Get two 'random' locations
				DBcon.query(
					'SELECT * FROM `TL_locations` WHERE `hidden`=0 ORDER BY `locationID` DESC LIMIT 2',
					handleQuery(next, randomLocations => {
						// Get most used locationID from the server (limit 2)
						DBcon.query(
							'SELECT `locationID`, `name`, `place`, `id`, `hidden`, COUNT(`locationID`) as `occurrence` FROM `TL_work` INNER JOIN `TL_locations` USING (`locationID`) WHERE `userID` = ? AND `hidden`=0 AND `date` >= ? AND `date` <= ? GROUP BY `locationID` ORDER BY `occurrence` DESC LIMIT 2',
							[
								(request.params.userID === '~') ? request.user?.userID : request.params.userID,
								moment().subtract(7, 'days').format('YYYY-MM-DD'), // Last week
								moment().format('YYYY-MM-DD') // Now
							],
							handleQuery(next, mostUsed => {
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
	},
	closeDatabaseConnection()
)

export default router
