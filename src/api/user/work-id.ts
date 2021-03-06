// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import {DBcon} from '../..'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'
import {handleQuery} from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import checkLateWork from '../../scripts/RequestHandler/check-late-work'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/user-id-check-handler'
import workIDuserIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/work-id-user-id-checkhandler'
import {patchHandler, handlePatchQuery} from '../../scripts/RequestHandler/patch-handler'
import settingsHandler from '../../scripts/RequestHandler/settings-handler'
import {TLWork, responseWork} from '../../scripts/response-work'
import {encodeText} from '../../scripts/test-encoding'
import {mysqlINT, mysqlDATE, mysqlUTFTEXT, mysqlFLOAT} from '../../scripts/types'

const router = expressRouter()

// Get a work object
router.get(
	'/:userID/work/:workID',
	getDatabaseConnection(),
	authHandler(request => (request.params.userID === '~') ? 'trackless.work.readOwn' : 'trackless.work.readAll'),
	userIDCheckHandler(),
	workIDuserIDCheckHandler(),
	(request, response, next) => {
		// Get the work from the server
		DBcon.query(
			'SELECT * FROM `TL_vWork` WHERE `user.userID`=? AND `workID`=?',
			[(request.params.userID === '~') ? request.user?.userID : request.params.userID, request.params.workID],
			handleQuery(next, (result: TLWork[]) => {
				responseWork(result, response)
			})
		)
	}
)

// Edit a work object
router.patch(
	'/:userID/work/:workID',
	getDatabaseConnection(),
	authHandler(request => (request.params.userID === '~') ? 'trackless.work.editOwn' : 'trackless.work.editAll'),
	userIDCheckHandler(),
	workIDuserIDCheckHandler(),
	settingsHandler(),
	checkLateWork(),
	patchHandler([
		{name: 'locationID', check: mysqlINT},
		{name: 'date', check: mysqlDATE},
		{name: 'time', check: mysqlFLOAT},
		{name: 'description', check: mysqlUTFTEXT},
		{name: 'worktypeID', check: mysqlINT}
	], ({resolve, reject, key, request, connection}) => {
		let body = request.body[key]

		if (key === 'description') {
			body = encodeText(request.body[key])
		}

		connection.query(
			'UPDATE `TL_work` SET `' + key + '`=? WHERE `workID`=? AND `userID`=?',
			[
				body,
				request.params.workID,
				(request.params.userID === '~') ? request.user?.userID : request.params.userID
			],
			handlePatchQuery(reject, resolve)
		)
	})
)

// Remove a work object
router.delete(
	'/:userID/work/:workID',
	getDatabaseConnection(),
	authHandler(request => (request.params.userID === '~') ? 'trackless.work.removeOwn' : 'trackless.work.removeAll'),
	userIDCheckHandler(),
	workIDuserIDCheckHandler(),
	settingsHandler(),
	checkLateWork(),
	(request, response, next) => {
		DBcon.query(
			'DELETE FROM `TL_work` WHERE `userID`=? AND `workID`=?',
			[
				(request.params.userID === '~') ? request.user?.userID : request.params.userID,
				request.params.workID
			],
			handleQuery(next, () => {
				response.status(200).json({
					message: 'done'
				})
			})
		)
	}
)

export default router
