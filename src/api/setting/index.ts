// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import {DBcon} from '../..'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'
import {handleQuery} from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import limitOffsetHandler from '../../scripts/RequestHandler/limit-offset-handler'
import requireHandler from '../../scripts/RequestHandler/require-handler'
import sortHandler from '../../scripts/RequestHandler/sort-handler'
import unusedRequestTypes from '../../scripts/RequestHandler/unused-request-type'
import {mysqlINT, mysqlTEXT, mysqlVARCHAR} from '../../scripts/types'
import settingIDhandler from './setting-id'

const router = expressRouter()

router.get(
	'/',
	getDatabaseConnection(),
	authHandler('trackless.setting.readAll'),
	sortHandler([
		'settingID',
		'setting',
		'value',
		'groupID',
		'groupName'
	]),
	limitOffsetHandler(),
	(request, response, next) => {
		DBcon.query(
			`SELECT \`settingID\`, \`setting\`, \`value\`, \`groupID\`, \`groupName\` FROM \`TL_settings\` JOIN \`TL_groups\` USING(\`groupID\`) ${request.querySort ?? ''} ${request.queryLimitOffset ?? ''}`,
			handleQuery(next, result => {
				response.json(result)
			})
		)
	}
)

router.post(
	'/',
	getDatabaseConnection(),
	authHandler('trackless.setting.create'),
	requireHandler([
		{name: 'setting', check: mysqlVARCHAR(64)},
		{name: 'value', check: mysqlTEXT},
		{name: 'groupID', check: mysqlINT}
	]),
	(request, response, next) => {
		DBcon.query(
			'INSERT INTO `TL_settings`(`groupID`, `setting`, `value`) VALUES (?, ?, ?)',
			[request.body.groupID, request.body.setting, request.body.value],
			handleQuery(next, result => {
				response.json({
					settingsID: result.insertId
				})
			})
		)
	}
)

router.use(settingIDhandler)
router.use(unusedRequestTypes())

export default router
