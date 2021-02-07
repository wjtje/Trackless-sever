// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../../..'
import {handleQuery} from '../../handle'
import ServerError from '../server-error-interface'

const userIDCheckHandler = (userIDfunc?: (request: Request) => number | string) => {
	return (request: Request, response: Response, next: NextFunction) => {
		const userID = (userIDfunc === null || userIDfunc === undefined) ? request.params.userID : userIDfunc(request)

		// Check if the userID is a number
		if (Number.isNaN(Number(userID)) && userID !== '~') {
			// UserID is not correct.
			const error: ServerError = new Error('The userID is not a number')
			error.status = 400
			error.code = 'trackless.checkId.NaN'
			next(error)
		} else {
			// Get the infomation from the database
			DBcon.query(
				'SELECT * FROM `TL_users` WHERE `userID`=?',
				[(userID === '~') ? request.user?.userID : userID],
				handleQuery(next, result => {
					if (result.length === 0) {
						// Group does not exsist
						const error: ServerError = new Error('The user does not exsist')
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

export default userIDCheckHandler

