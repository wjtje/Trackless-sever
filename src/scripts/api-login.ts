// Copyright (c) 2020 Wouter van der Wal

import {DBcon} from '../index'
import {sha512_256 as sha512} from 'js-sha512'
import {get as _get} from 'lodash'

/**
 * Check the api key in the database
 *
 * @since 0.2-beta.1
 * @param apiKey
 */
export async function apiLogin(apiKey: string): Promise<{
	userID: number;
	username: string;
	firstname: string;
	lastname: string;
	groupID: number;
}> {
	return new Promise((resolve, reject) => {
		// Check the api key
		DBcon.query(
			'SELECT `userID`, `username`, `firstname`, `lastname`, `groupID` FROM `TL_apikeys` INNER JOIN `TL_users` USING (`userID`) WHERE apiKey=?',
			[sha512(apiKey)],
			(error, result) => {
				if (error || result.length === 0) { // An sql error or invalid api key
					// Internal error
					DBcon.query(
						'INSERT INTO `TL_errors` (`error_code`, `error_message`) VALUES (?,?)',
						[
							_get(error, 'code', 'Wrong api key'),
							'Api key not found or internal error'
						]
					)

					// Reject the request
					reject(
						(error) ? error.code : 'account not found'
					)
				} else {
					// Api key is correct
					// Update the last used
					DBcon.query(
						'UPDATE `TL_apikeys` SET `lastUsed`=CURRENT_TIMESTAMP WHERE `apiKey`=?',
						[sha512(apiKey)],
						error => {
							// Document the error
							if (error) {
								DBcon.query(
									'INSERT INTO `TL_errors` (`error_code`, `error_message`) VALUES (?,?)',
									[
										error.code,
										'Something went wrong'
									]
								)
							}
						}
					)

					resolve(result[0])
				}
			}
		)
	})
}