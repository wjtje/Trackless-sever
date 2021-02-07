// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unused-request-type'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import accessIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/access-id-check-handler'
import {DBcon} from '../..'
import {handleQuery} from '../../scripts/handle'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'

const router = expressRouter()

// Get a single access rule
router.get(
	'/:accessID',
	getDatabaseConnection(),
	authHandler('trackless.access.readAll'),
	accessIDCheckHandler(),
	(request, response, next) => {
		// Get the data from the server
		DBcon.query(
			'SELECT `accessID`, `access`, `groupID` FROM `TL_access` WHERE `accessID`=?',
			[request.params?.accessID],
			handleQuery(next, result => {
				response.status(200).json(result)
			})
		)
	},
	closeDatabaseConnection()
)

// Remove a access rule
router.delete(
	'/:accessID',
	getDatabaseConnection(),
	authHandler('trackless.access.remove'),
	accessIDCheckHandler(),
	(request, response, next) => {
		// Remove from the server
		DBcon.query(
			'DELETE FROM `TL_access` WHERE `accessID`=?',
			[request.params.accessID],
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
