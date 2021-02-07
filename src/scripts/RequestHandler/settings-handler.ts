// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../..'
import {handleQuery} from '../handle'

/**
 * An express request handler for loading all the group settings
 */
const settingsHandler = () => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Init the var
		response.locals.setting = {}

		// Check if a groupID is defined
		if (request.user?.groupID === undefined) {
			next()
		} else {
			// Get all the settings from the database
			DBcon.query(
				'SELECT `setting`, `value` FROM `TL_settings` WHERE `groupID` = ?',
				[request.user.groupID],
				handleQuery(next, (result: Array<{
					setting: string;
					value: string;
				}>) => {
					// Add result to response.local.setting
					result.forEach(element => {
						response.locals.setting[element.setting] = element.value
					})

					next()
				})
			)
		}
	}
}

export default settingsHandler
