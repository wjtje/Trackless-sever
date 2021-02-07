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

// Get all settings for a single group
router.get(
	'/:groupID/setting',
	getDatabaseConnection(),
	authHandler('trackless.setting.readAll'),
	groupIDCheckHandler(),
	limitOffsetHandler(),
	(request, response, next) => {
		DBcon.query(
			`SELECT settingID, setting, value, groupID, groupName FROM TL_settings join TL_groups USING(groupID) where groupID=? ${request.queryLimitOffset ?? ''}`,
			[request.params.groupID],
			handleQuery(next, result => {
				response.json(result)
			})
		)
	}
)

// Create a new setting for a single group
router.post(
	'/:groupID/setting',
	getDatabaseConnection(),
	authHandler('trackless.setting.create'),
	groupIDCheckHandler(),
	requireHandler([
		{name: 'setting', check: mysqlTEXT},
		{name: 'value', check: mysqlTEXT}
	]),
	(request, response, next) => {
		DBcon.query(
			'INSERT INTO `TL_settings`(`groupID`, `setting`, `value`) VALUES (?, ?, ?)',
			[request.params.groupID, request.body.setting, request.body.value],
			handleQuery(next, result => {
				response.json({
					settingsID: result.insertId
				})
			})
		)
	}
)

export default router
