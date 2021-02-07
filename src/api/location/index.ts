// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unused-request-type'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import {DBcon} from '../..'
import {handleQuery} from '../../scripts/handle'
import requireHandler from '../../scripts/RequestHandler/require-handler'
import {mysqlTEXT} from '../../scripts/types'
import locationIDRoute from './location-id'
import sortHandler from '../../scripts/RequestHandler/sort-handler'
import limitOffsetHandler from '../../scripts/RequestHandler/limit-offset-handler'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'

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
	(request, response, next) => {
		// Get all the locations
		// Check if the user wants to see hidden locations
		// Check how we need to sort the array
		// Check if we need a limit or offset
		request.database?.connection?.query(
			`SELECT * FROM TL_vLocations
        ${(request.query.hidden === undefined) ? 'WHERE `hidden`=0' : ''} 
        ${request.querySort ?? 'ORDER BY `place`, `name`'}
        ${request.queryLimitOffset ?? ''}
      `,
			handleQuery(next, result => {
				response.status(200).json(result)
				next()
			})
		)
	},
	closeDatabaseConnection()
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
	(request, response, next) => {
		// Push to the server
		DBcon.query(
			'INSERT INTO `TL_locations` (`name`, `place`, `id`) VALUES (?, ?, ?)',
			[
				request.body.name,
				request.body.place,
				request.body.id
			],
			handleQuery(next, result => {
				// Respond to the user
				response.status(201).json({
					locationID: result.insertId
				})
			})
		)
	},
	closeDatabaseConnection()
)

router.use('/', locationIDRoute)

router.use(unusedRequestTypes())

export default router
