// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import {DBcon} from '../..'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'
import {handleQuery} from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/user-id-check-handler'
import limitOffsetHandler from '../../scripts/RequestHandler/limit-offset-handler'

const router = expressRouter()

// List all access rules for a user
router.get(
	'/:userID/access',
	getDatabaseConnection(),
	authHandler(request => (request.params.userID === '~') ? 'trackless.access.readOwn' : 'trackless.access.readAll'),
	userIDCheckHandler(),
	limitOffsetHandler(),
	(request, response, next) => {
		DBcon.query(
			`SELECT \`access\`, \`accessID\` FROM \`TL_access\` a INNER JOIN \`TL_users\` u ON a.groupID = u.groupID WHERE u.userID = ? ${request.queryLimitOffset ?? ''}`,
			[(request.params.userID === '~') ? request.user?.userID : request.params.userID],
			handleQuery(next, result => {
				response.status(200).json(result)
			})
		)
	},
	closeDatabaseConnection()
)

export default router
