// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import {logger} from '../..'
import mysqlBOOLEAN from '../../data-types/mysql-boolean'
import mysqlTEXT from '../../data-types/mysql-text'
import databaseQuery from '../../database/query'
import authHandler from '../../handlers/auth-handler'
import {getDatabaseConnection} from '../../handlers/database-connection'
import idChecker from '../../handlers/id-checker'
import patchHandler from '../../handlers/path-handler'

const router = expressRouter()

// Get a single location
router.get(
	'/:locationID',
	getDatabaseConnection(),
	authHandler('trackless.location.read'),
	idChecker('locationID', 'TL_locations'),
	async (request, response, next) => {
		// Get the data from the server
		try {
			const result = await databaseQuery(
				request.database.connection,
				'SELECT * FROM `TL_vLocations` WHERE `locationID`=?',
				[request.params.locationID]
			)

			response.status(200).json(result)
		} catch (error: unknown) {
			next(error)
		}
	}
)

// Remove a location
router.delete(
	'/:locationID',
	getDatabaseConnection(),
	authHandler('trackless.location.remove'),
	idChecker('locationID', 'TL_locations'),
	async (request, response, next) => {
		// Delete from database
		try {
			void await databaseQuery(
				request.database.connection,
				'DELETE FROM `TL_locations` WHERE `locationID`=?',
				[request.params.locationID]
			)

			response.status(200).json({
				message: 'done'
			})
		} catch (error: unknown) {
			next(error)
		}
	}
)

// Edit a location
router.patch(
	'/:locationID',
	getDatabaseConnection(),
	authHandler('trackless.location.edit'),
	idChecker('locationID', 'TL_locations'),
	patchHandler([
		{name: 'name', check: mysqlTEXT},
		{name: 'place', check: mysqlTEXT},
		{name: 'id', check: mysqlTEXT},
		{name: 'hidden', check: mysqlBOOLEAN}
	], async (resolve, reject, key, request) => {
		// Update the key
		try {
			await databaseQuery(
				request.database.connection,
				'UPDATE `TL_locations` SET `' + key + '`=? WHERE `locationID`=?',
				[request.body[key], request.params.locationID]
			)

			logger.info(`Updated '${key}' on location: ${request.params.locationID}`)

			resolve()
		} catch { // Catch any and all error's
			reject()
		}
	})
)

export default router
