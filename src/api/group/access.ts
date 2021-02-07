// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import {DBcon} from '../..'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'
import {handleQuery} from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import groupIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/group-id-check-handler'
import limitOffsetHandler from '../../scripts/RequestHandler/limit-offset-handler'
import requireHandler from '../../scripts/RequestHandler/require-handler'
import {mysqlTEXT} from '../../scripts/types'

const router = expressRouter()

// List all access rules for a group
router.get(
	'/:groupID/access',
	getDatabaseConnection(),
	authHandler('trackless.access.readAll'),
	groupIDCheckHandler(),
	limitOffsetHandler(),
	(request, response, next) => {
		DBcon.query(
			`SELECT \`accessID\`, \`access\` FROM \`TL_access\` WHERE \`groupID\`=? ${request.queryLimitOffset ?? ''}`,
			[request.params.groupID],
			handleQuery(next, result => {
				response.status(200).json(result)
			})
		)
	}
)

// Add a new access rule for a group
router.post(
	'/:groupID/access',
	getDatabaseConnection(),
	authHandler('trackless.access.create'),
	requireHandler([
		{name: 'access', check: mysqlTEXT}
	]),
	groupIDCheckHandler(),
	(request, response, next) => {
		// Save it to the database
		DBcon.query(
			'INSERT INTO `TL_access` (`groupID`, `access`) VALUES (?,?)',
			[
				request.params.groupID,
				request.body.access
			],
			handleQuery(next, result => {
				response.status(201).json({
					accessID: result.insertId
				})
			})
		)
	}
)

export default router
