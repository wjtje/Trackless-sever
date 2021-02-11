// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import locationIDRoute from './location-id'
import {getDatabaseConnection} from '../../handlers/database-connection'
import authHandler from '../../handlers/auth-handler'
import sortHandler from '../../handlers/sort-handler'
import limitOffsetHandler from '../../handlers/limit-offset-handler'
import databaseQuery from '../../database/query'
import requireHandler from '../../handlers/require-handler'
import mysqlTEXT from '../../data-types/mysql-text'

const router = expressRouter()

// Get all the location on the server
router.get(
	'/',
	getDatabaseConnection(),
	authHandler('trackless.location.read'),
	sortHandler([
		'locationID',
		'name',
		'place',
		'id',
		'hidden',
		'time'
	]),
	limitOffsetHandler(),
	async (request, response, next) => {
		try {
			// Get all the locations
			// Check if the user wants to see hidden locations
			// Check how we need to sort the array
			// Check if we need a limit or offset
			const result = await databaseQuery(
				request.database?.connection,
				`SELECT * FROM TL_vLocations
					${(request.query.hidden === undefined) ? 'WHERE `hidden`=0' : ''} 
					${request.querySort ?? 'ORDER BY `place`, `name`'}
					${request.queryLimitOffset ?? ''}
				`,
				[]
			)

			// Send the response to the user
			response.status(200).json(result)
		} catch (error: unknown) {
			next(error)
		}
	}
)

// Add a new location to the system
router.post(
	'/',
	getDatabaseConnection(),
	authHandler('trackless.location.create'),
	requireHandler([
		{name: 'name', check: mysqlTEXT},
		{name: 'place', check: mysqlTEXT},
		{name: 'id', check: mysqlTEXT}
	]),
	async (request, response, next) => {
		// Push to the server
		try {
			const result = await databaseQuery(
				request.database.connection,
				'INSERT INTO `TL_locations` (`name`, `place`, `id`) VALUES (?, ?, ?)',
				[
					request.body.name,
					request.body.place,
					request.body.id
				]
			)

			response.status(201).json({
				locationID: result.insertId
			})
		} catch (error: unknown) {
			// Catch any error's
			next(error)
		}
	}
)

router.use('/', locationIDRoute)

export default router
