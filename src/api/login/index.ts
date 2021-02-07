// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unused-request-type'
import requireHandler from '../../scripts/RequestHandler/require-handler'
import {mysqlTEXT, mysqlUTFTEXT} from '../../scripts/types'
import {DBcon} from '../..'
import {handleQuery} from '../../scripts/handle'
import {sha512_256 as sha512} from 'js-sha512'
import _ from 'lodash'
import {encodeText} from '../../scripts/test-encoding'
import ServerError from '../../classes/server-error'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'

const router = expressRouter()

router.post(
	'/',
	getDatabaseConnection(),
	requireHandler([
		{name: 'username', check: mysqlTEXT},
		{name: 'password', check: mysqlTEXT},
		{name: 'deviceName', check: mysqlUTFTEXT}
	]),
	(request, response, next) => {
		// Get the hash, salt and userID from the server
		DBcon.query(
			'SELECT `salt_hash`, `hash`, `userID` FROM `TL_users` WHERE `username`=?',
			[request.body.username],
			handleQuery(next, result => {
				// Check the password
				if (sha512(String(request.body.password) + String(_.get(result, '[0].salt_hash', ''))) === _.get(result, '[0].hash', '')) {
					// Password correct
					// Create an apiKey using time
					const apiKey: string = sha512(Date.now().toString())

					// Save it to the database
					DBcon.query(
						'INSERT INTO `TL_apikeys` (`apiKey`, `deviceName`, `userID`) VALUES (?,?,?)',
						[
							sha512(apiKey),
							encodeText(request.body.deviceName),
							result[0].userID
						],
						handleQuery(next, () => {
							response.status(200).json({
								bearer: apiKey
							})
						})
					)
				} else {
					// Incorrect password or username
					next(new ServerError(
						'Incorrect username or password',
						400,
						'trackless.login.badLogin'
					))
				}
			})
		)
	},
	closeDatabaseConnection()
)

router.use(unusedRequestTypes())

export default router
