// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../../..'
import ServerError from '../../../classes/server-error'
import {handleQuery} from '../../handle'

const settingIDCheckHandler = () => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Check if the settingID is a number
		if (Number.isNaN(Number(request.params.settingID))) {
			// SettingID is not correct.
			next(new ServerError(
				'The settingID is not a number',
				400,
				'trackless.checkID.NaN'
			))
		} else {
			// Get the infomation from the database
			DBcon.query(
				'SELECT * FROM `TL_settings` WHERE `settingID`=?',
				[request.params.settingID],
				handleQuery(next, result => {
					if (result.length === 0) {
						// Group does not exsist
						next(new ServerError(
							'The setting does not exsist',
							404,
							'trackless.checkID.notFound'
						))
					} else {
						next()
					}
				})
			)
		}
	}
}

export default settingIDCheckHandler
