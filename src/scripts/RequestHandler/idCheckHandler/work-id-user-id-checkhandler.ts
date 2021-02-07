// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../../..'
import {handleQuery} from '../../handle'
import ServerError from '../server-error-interface'

const workIDuserIDCheckHandler = () => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Check if the workID is a number
		if (Number.isNaN(Number(request.params.workID))) {
			// WorkID is not correct.
			const error: ServerError = new Error('The workID is not a number')
			error.status = 400
			error.code = 'trackless.checkId.NaN'
			next(error)
		} else {
			// Get the infomation from the database
			DBcon.query(
				'SELECT * FROM `TL_work` WHERE `workID`=? AND `userID`=?',
				[request.params.workID, (request.params.userID === '~') ? request.user?.userID : request.params.userID],
				handleQuery(next, result => {
					if (result.length === 0) {
						// Group does not exsist
						const error: ServerError = new Error('The workID does not exsist')
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

export default workIDuserIDCheckHandler
