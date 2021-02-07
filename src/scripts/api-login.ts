// Copyright (c) 2020 Wouter van der Wal

import {DBcon} from '../index'
import {sha512_256 as sha512} from 'js-sha512'
import {get as _get} from 'lodash'
import databaseQuery from '../database/query'
import ServerError from '../classes/server-error'

/**
 * Check if the apiKey is correct and respond with the correct user
 */
const apiLogin = async (apiKey: string): Promise<Record<string, any>> => {
	return new Promise((resolve, reject) => {
		// Get an connection to the database
		DBcon.getConnection((error, connection) => {
			// Check for any error's
			if (error) {
				reject(error)
			}

			// Find the correct user from the database
			databaseQuery(
				connection,
				'SELECT `userID`, `username`, `firstname`, `lastname`, `groupID` FROM `TL_apikeys` INNER JOIN `TL_users` USING (`userID`) WHERE apiKey=?',
				[sha512(apiKey)]
			)
				.then(result => {
					if (result.length > 0) {
						// Update the last used time
						databaseQuery(
							connection,
							'UPDATE `TL_apikeys` SET `lastUsed`=CURRENT_TIMESTAMP WHERE `apiKey`=?',
							[sha512(apiKey)]
						)
							.then(_ => {
								// Give back the user
								resolve(result[0])
							})
							.catch(reject)
							.finally(() => {
								// Close the connection
								connection.release()
							})
					} else {
						// Close the connection
						connection.release()
						reject(new ServerError(
							'Account not found',
							403,
							'trackless.apiLogin.notFound'
						))
					}
				})
				.catch(error => {
					// Close the connection
					connection.release()
					reject(error)
				})
		})
	})
}

export default apiLogin
