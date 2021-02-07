// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unused-request-type'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import {DBcon} from '../..'
import {handleQuery} from '../../scripts/handle'
import {patchHandler, handlePatchQuery} from '../../scripts/RequestHandler/patch-handler'
import {mysqlTEXT} from '../../scripts/types'
import worktypeIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/worktype-id-check-handler'
import ServerError from '../../classes/server-error'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'

const router = expressRouter()

// Get by worktypeID
router.get(
	'/:worktypeID',
	getDatabaseConnection(),
	authHandler('trackless.worktype.read'),
	worktypeIDCheckHandler(),
	(request, response, next) => {
		// Get the data from the server
		DBcon.query(
			'SELECT `worktypeID`, `name` FROM `TL_worktype` WHERE `worktypeID`=?',
			[request.params.worktypeID],
			handleQuery(next, result => {
				// Send the result back
				response.status(200).json(result)
			})
		)
	}
)

// Remove a worktype
router.delete(
	'/:worktypeID',
	getDatabaseConnection(),
	authHandler('trackless.worktype.remove'),
	worktypeIDCheckHandler(),
	(request, response, next) => {
		// Remove the user
		DBcon.query(
			'DELETE FROM `TL_worktype` WHERE `worktypeID`=?',
			[request.params.worktypeID],
			handleQuery(next, () => {
				response.status(200).json({
					message: 'done'
				})
			}, () => {
				next(new ServerError(
					'Worktype can not be removed',
					409,
					'trackless.worktype.removeFailed'
				))
			})
		)
	}
)

// Edit a worktype
router.patch(
	'/:worktypeID',
	getDatabaseConnection(),
	authHandler('trackless.worktype.edit'),
	worktypeIDCheckHandler(),
	patchHandler(
		[
			{name: 'name', check: mysqlTEXT}
		],
		({resolve, reject, key, request, connection}) => {
			connection.query(
				'UPDATE `TL_worktype` SET `' + key + '`=? WHERE `worktypeID`=?',
				[
					request.body[key],
					request.params.worktypeID
				],
				handlePatchQuery(reject, resolve)
			)
		}
	)
)

router.use(unusedRequestTypes())

export default router
