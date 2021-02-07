// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import {DBcon} from '../..'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'
import {handleQuery} from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/user-id-check-handler'
import limitOffsetHandler from '../../scripts/RequestHandler/limit-offset-handler'

const router = expressRouter()

// Get all settings for a single user
router.get(
	'/:userID/setting',
	getDatabaseConnection(),
	authHandler(request => (request.params.userID === '~') ? 'trackless.setting.readOwn' : 'trackless.setting.readAll'),
	userIDCheckHandler(),
	limitOffsetHandler(),
	(request, response, next) => {
		DBcon.query(
			`SELECT settingID, setting, value, groupID, groupName FROM TL_settings join TL_groups USING(groupID) join TL_users USING(groupID) where userID=? ${request.queryLimitOffset ?? ''}`,
			[(request.params.userID === '~') ? request.user?.userID : request.params.userID],
			handleQuery(next, result => {
				response.json(result)
			})
		)
	},
	closeDatabaseConnection()
)

export default router
