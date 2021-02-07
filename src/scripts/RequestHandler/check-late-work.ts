// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import moment from 'moment'
import {DBcon} from '../..'
import {handleQuery} from '../handle'
import ServerError from './server-error-interface'

/**
 * Check if work is allowed to be edit
 */
const checkLateWork = () => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Custom function for checking if you are allowed to edit this
		DBcon.query(
			'SELECT `date` FROM `TL_work` where `workID`=?',
			[request.params.workID],
			handleQuery(next, result => {
				// Check if the user is allowed to add work
				if (response.locals.setting?.workLateDays === null) {
					next()
				} else if (moment(result[0].date).isAfter(moment().subtract(Number(response.locals.setting.workLateDays), 'days'))) {
					next()
				} else {
					const error: ServerError = new Error('You are not allowed to save work')
					error.code = 'trackless.work.toLate'
					error.status = 400
					next(error)
				}
			})
		)
	}
}

export default checkLateWork
