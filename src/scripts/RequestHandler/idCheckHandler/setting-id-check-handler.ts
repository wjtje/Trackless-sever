// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../../..'
import {handleQuery} from '../../handle'
import ServerError from '../server-error-interface'

const settingIDCheckHandler = () => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Check if the settingID is a number
		if (Number.isNaN(Number(request.params.settingID))) {
			// SettingID is not correct.
			const error: ServerError = new Error('The settingID is not a number')
			error.status = 400
			error.code = 'trackless.checkId.NaN'
			next(error)
		} else {
			// Get the infomation from the database
			DBcon.query(
				'SELECT * FROM `TL_settings` WHERE `settingID`=?',
				[request.params.settingID],
				handleQuery(next, result => {
					if (result.length === 0) {
						// Group does not exsist
						const error: ServerError = new Error('The setting does not exsist')
						error.status = 404
						error.code = 'trackless.checkId.notFound'
						next(error)
					} else {
						next()
					}
				})
			)
		}
	}
}

export default settingIDCheckHandler
