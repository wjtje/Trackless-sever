// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unused-request-type'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import {DBcon} from '../..'
import {handleQuery} from '../../scripts/handle'
import requireHandler from '../../scripts/RequestHandler/require-handler'
import {mysqlTEXT} from '../../scripts/types'
import sortHandler from '../../scripts/RequestHandler/sort-handler'
import worktypeIDRouter from './worktype-id'
import limitOffsetHandler from '../../scripts/RequestHandler/limit-offset-handler'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'

const router = expressRouter()

// Get all the users from the system
router.get(
	'/',
	getDatabaseConnection(),
	authHandler('trackless.worktype.read'),
	sortHandler([
		'worktypeID',
		'name'
	]),
	limitOffsetHandler(),
	(request, response, next) => {
		// Send the request
		DBcon.query(
			`SELECT \`worktypeID\`, \`name\` FROM \`TL_worktype\` ${request.querySort ?? ' ORDER BY `name`'} ${request.queryLimitOffset ?? ''}`,
			handleQuery(next, result => {
				response.status(200).json(result)
			})
		)
	}
)

// Create a new user
router.post(
	'/',
	getDatabaseConnection(),
	authHandler('trackless.worktype.create'),
	requireHandler([
		{name: 'name', check: mysqlTEXT}
	]),
	(request, response, next) => {
		DBcon.query(
			'INSERT INTO `TL_worktype` ( `name` ) VALUES ( ? )',
			[
				request.body.name
			],
			handleQuery(next, result => {
				response.status(201).json({
					worktypeID: result.insertId
				})
			})
		)
	}
)

router.use('/', worktypeIDRouter)

router.use(unusedRequestTypes())

export default router
