// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unused-request-type'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import {DBcon} from '../..'
import {handleQuery} from '../../scripts/handle'
import requireHandler from '../../scripts/RequestHandler/require-handler'
import {mysqlINT, mysqlTEXT} from '../../scripts/types'
import accessIDRoute from './access-id'
import sortHandler from '../../scripts/RequestHandler/sort-handler'
import groupIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/group-id-check-handler'
import limitOffsetHandler from '../../scripts/RequestHandler/limit-offset-handler'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'

const router = expressRouter()

// Get your access
router.get(
	'/',
	getDatabaseConnection(),
	authHandler('trackless.access.readAll'),
	sortHandler([
		'groupID',
		'accessID',
		'access'
	]),
	limitOffsetHandler(),
	(request, response, next) => {
		// Get all the data from the server
		DBcon.query(
			'SELECT `accessID`, `access`, `groupID` FROM `TL_access`' + String(request.querySort ?? '') + ` ${request.queryLimitOffset ?? ''}`,
			handleQuery(next, result => {
				response.status(200).json(result)
			})
		)
	},
	closeDatabaseConnection()
)

// Give someone access
router.post(
	'/',
	getDatabaseConnection(),
	authHandler('trackless.access.create'),
	requireHandler([
		{name: 'groupID', check: mysqlINT},
		{name: 'access', check: mysqlTEXT}
	]),
	groupIDCheckHandler(request => request.body.groupID),
	(request, response, next) => {
		// Save it to the database
		DBcon.query(
			'INSERT INTO `TL_access` (`groupID`, `access`) VALUES (?,?)',
			[
				request.body.groupID,
				request.body.access
			],
			handleQuery(next, result => {
				response.status(201).json({
					accessID: result.insertId
				})
			})
		)
	},
	closeDatabaseConnection()
)

router.use('/', accessIDRoute)

router.use(unusedRequestTypes())

export default router
