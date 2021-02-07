// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../../..'
import {handleQuery} from '../../handle'
import ServerError from '../server-error-interface'

const worktypeIDCheckHandler = () => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Check if the worktypeID is a number
		if (Number.isNaN(Number(request.params.worktypeID))) {
			// WorktypeID is not correct.
			const error: ServerError = new Error('The worktypeID is not a number')
			error.status = 400
			error.code = 'trackless.checkId.NaN'
			next(error)
		} else {
			// Get the infomation from the database
			DBcon.query(
				'SELECT * FROM `TL_worktype` WHERE `worktypeID`=?',
				[request.params.worktypeID],
				handleQuery(next, result => {
					if (result.length === 0) {
						// Group does not exsist
						const error: ServerError = new Error('The worktypeID does not exsist')
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

export default worktypeIDCheckHandler
