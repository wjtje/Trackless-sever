// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../../..'
import ServerError from '../../../classes/server-error'
import {handleQuery} from '../../handle'

const userIDCheckHandler = (userIDfunc?: (request: Request) => number | string) => {
	return (request: Request, response: Response, next: NextFunction) => {
		const userID = (userIDfunc === null || userIDfunc === undefined) ? request.params.userID : userIDfunc(request)

		// Check if the userID is a number
		if (Number.isNaN(Number(userID)) && userID !== '~') {
			// UserID is not correct.
			next(new ServerError(
				'The userID is not a number',
				400,
				'trackless.checkID.NaN'
			))
		} else {
			// Get the infomation from the database
			DBcon.query(
				'SELECT * FROM `TL_users` WHERE `userID`=?',
				[(userID === '~') ? request.user?.userID : userID],
				handleQuery(next, result => {
					if (result.length === 0) {
						// UserID does not exsist
						next(new ServerError(
							'The userID does not exsist',
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

export default userIDCheckHandler

