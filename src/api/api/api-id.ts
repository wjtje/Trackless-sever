// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unused-request-type'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import apiIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/api-id-check-handler'
import {DBcon} from '../..'
import {handleQuery} from '../../scripts/handle'
import {decodeJSON} from '../../scripts/test-encoding'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'

const router = expressRouter()

// Get infomation about a single api key
router.get(
	'/:apiID',
	getDatabaseConnection(),
	authHandler('trackless.api.read'),
	apiIDCheckHandler(),
	(request, response, next) => {
		// Get the data from the server
		DBcon.query(
			'SELECT `apiID`, `createDate`, `lastUsed`, `deviceName` FROM `TL_apikeys` WHERE `userID`=? AND `apiID`=?',
			[request.user?.userID, request.params.apiID],
			handleQuery(next, result => {
				// Send the data back to the user
				response.status(200).json(decodeJSON(result, 'deviceName'))
			})
		)
	},
	closeDatabaseConnection()
)

// Remove a single api key
router.delete(
	'/:apiID',
	getDatabaseConnection(),
	authHandler('trackless.api.remove'),
	apiIDCheckHandler(),
	(request, response, next) => {
		// Send the command to the server
		DBcon.query(
			'DELETE FROM `TL_apikeys` WHERE `apiID`=? and `userID`=?',
			[request.params.apiID, request.user?.userID],
			handleQuery(next, () => {
				response.status(200).json({
					message: 'done'
				})
			})
		)
	},
	closeDatabaseConnection()
)

router.use(unusedRequestTypes())

export default router
