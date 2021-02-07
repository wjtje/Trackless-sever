// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unused-request-type'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import locationIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/location-id-check-handler'
import {DBcon} from '../..'
import {handleQuery} from '../../scripts/handle'
import {patchHandler, handlePatchQuery} from '../../scripts/RequestHandler/patch-handler'
import {mysqlTEXT, mysqlBOOLEAN} from '../../scripts/types'
import ServerError from '../../scripts/RequestHandler/server-error-interface'

const router = expressRouter()

router.get(
	'/:locationID',
	authHandler('trackless.location.read'),
	locationIDCheckHandler(),
	(request, response, next) => {
		// Get the data from the server
		DBcon.query(
			'SELECT * FROM `TL_vLocations` WHERE `locationID`=?',
			[request.params.locationID],
			handleQuery(next, result => {
				response.status(200).json(result)
			})
		)
	}
)

router.delete(
	'/:locationID',
	authHandler('trackless.location.remove'),
	locationIDCheckHandler(),
	(request, response, next) => {
		// Delete from database
		DBcon.query(
			'DELETE FROM `TL_locations` WHERE `locationID`=?',
			[request.params.locationID],
			handleQuery(next, () => {
				response.status(200).json({
					message: 'done'
				})
			}, () => {
				const error: ServerError = new Error('Location can not be removed')
				error.code = 'trackless.location.removeFailed'
				error.status = 409
				next(error)
			})
		)
	}
)

router.patch(
	'/:locationID',
	authHandler('trackless.location.edit'),
	locationIDCheckHandler(),
	patchHandler([
		{name: 'name', check: mysqlTEXT},
		{name: 'place', check: mysqlTEXT},
		{name: 'id', check: mysqlTEXT},
		{name: 'hidden', check: mysqlBOOLEAN}
	], ({resolve, reject, key, request, connection}) => {
		// Update the key
		connection.query(
			'UPDATE `TL_locations` SET `' + key + '`=? WHERE `locationID`=?',
			[request.body[key], request.params.locationID],
			handlePatchQuery(reject, resolve)
		)
	})
)

router.use(unusedRequestTypes)

export default router
