// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import locationIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/location-id-check-handler'
import {DBcon} from '../..'
import {handleQuery} from '../../scripts/handle'
import {patchHandler, handlePatchQuery} from '../../scripts/RequestHandler/patch-handler'
import {mysqlTEXT, mysqlBOOLEAN} from '../../scripts/types'
import ServerError from '../../classes/server-error'
import {getDatabaseConnection} from '../../handlers/database-connection'

const router = expressRouter()

// Get a single location
router.get(
	'/:locationID',
	getDatabaseConnection(),
	authHandler('trackless.location.read'),
	locationIDCheckHandler(),
	(request, response, next) => {
		// Get the data from the server
		DBcon.query(
			'SELECT * FROM `TL_vLocations` WHERE `locationID`=?',
			[request.params.locationID],
			handleQuery(next, result => {
				response.status(200).json(result)
			})
		)
	}
)

// Remove a location
router.delete(
	'/:locationID',
	getDatabaseConnection(),
	authHandler('trackless.location.remove'),
	locationIDCheckHandler(),
	(request, response, next) => {
		// Delete from database
		DBcon.query(
			'DELETE FROM `TL_locations` WHERE `locationID`=?',
			[request.params.locationID],
			handleQuery(next, () => {
				response.status(200).json({
					message: 'done'
				})
			}, () => {
				next(new ServerError(
					'Location can not be removed',
					409,
					'trackless.location.removeFailed'
				))
			})
		)
	}
)

// Edit a location
router.patch(
	'/:locationID',
	getDatabaseConnection(),
	authHandler('trackless.location.edit'),
	locationIDCheckHandler(),
	patchHandler([
		{name: 'name', check: mysqlTEXT},
		{name: 'place', check: mysqlTEXT},
		{name: 'id', check: mysqlTEXT},
		{name: 'hidden', check: mysqlBOOLEAN}
	], ({resolve, reject, key, request, connection}) => {
		// Update the key
		connection.query(
			'UPDATE `TL_locations` SET `' + key + '`=? WHERE `locationID`=?',
			[request.body[key], request.params.locationID],
			handlePatchQuery(reject, resolve)
		)
	})
)

export default router
