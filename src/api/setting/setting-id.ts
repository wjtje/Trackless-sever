// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import {DBcon} from '../..'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'
import {handleQuery} from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import settingIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/setting-id-check-handler'
import {handlePatchQuery, patchHandler} from '../../scripts/RequestHandler/patch-handler'
import {mysqlINT, mysqlTEXT} from '../../scripts/types'

const router = expressRouter()

// Get infomation about a single setting
router.get(
	'/:settingID',
	getDatabaseConnection(),
	authHandler('trackless.setting.readAll'),
	settingIDCheckHandler(),
	(request, response, next) => {
		DBcon.query(
			'SELECT settingID, setting, value, groupID, groupName FROM TL_settings join TL_groups USING(groupID) where settingID=?',
			[request.params.settingID],
			handleQuery(next, result => {
				response.json(result)
			})
		)
	},
	closeDatabaseConnection()
)

// Remove a single setting
router.delete(
	'/:settingID',
	getDatabaseConnection(),
	authHandler('trackless.setting.remove'),
	settingIDCheckHandler(),
	(request, response, next) => {
		DBcon.query(
			'DELETE FROM `TL_settings` WHERE `settingID`=?',
			[request.params.settingID],
			handleQuery(next, () => {
				response.status(200).json({
					message: 'success'
				})
			})
		)
	},
	closeDatabaseConnection()
)

// Edit a setting
router.patch(
	'/:settingID',
	getDatabaseConnection(),
	authHandler('trackless.setting.edit'),
	patchHandler(
		[
			{name: 'groupID', check: mysqlINT},
			{name: 'setting', check: mysqlTEXT},
			{name: 'value', check: mysqlTEXT}
		],
		({resolve, reject, key, request, connection}) => {
			connection.query(
				'UPDATE `TL_settings` SET `' + key + '`=? WHERE `settingID`=?',
				[
					request.body[key],
					request.params.settingID
				],
				handlePatchQuery(reject, resolve)
			)
		}
	),
	closeDatabaseConnection()
)

export default router
