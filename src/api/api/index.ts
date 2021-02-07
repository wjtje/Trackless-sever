// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unused-request-type'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import {DBcon} from '../..'
import {handleQuery} from '../../scripts/handle'
import apiIDRoute from './api-id'
import sortHandler from '../../scripts/RequestHandler/sort-handler'
import {decodeJSON} from '../../scripts/test-encoding'
import limitOffsetHandler from '../../scripts/RequestHandler/limit-offset-handler'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'

const router = expressRouter()

// Get all your active api keys
router.get(
	'/',
	getDatabaseConnection(),
	authHandler('trackless.api.read'),
	sortHandler([
		'apiID',
		'createDate',
		'lastUsed',
		'deviceName'
	]),
	limitOffsetHandler(),
	(request, response, next) => {
		// Get all the api keys from the server
		DBcon.query(
			'SELECT `apiID`, `createDate`, `lastUsed`, `deviceName` FROM `TL_apikeys` WHERE `userID`=?' + String(request.querySort ?? '') + ` ${request.queryLimitOffset ?? ''}`,
			[request.user?.userID],
			handleQuery(next, result => {
				// Send the data back to the user
				response.status(200).json(decodeJSON(result, 'deviceName'))
			})
		)
	}
)

router.use('/', apiIDRoute)

router.use(unusedRequestTypes())

export default router
