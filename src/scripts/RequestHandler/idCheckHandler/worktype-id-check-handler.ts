// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../../..'
import ServerError from '../../../classes/server-error'
import {handleQuery} from '../../handle'

const worktypeIDCheckHandler = () => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Check if the worktypeID is a number
		if (Number.isNaN(Number(request.params.worktypeID))) {
			// WorktypeID is not correct.
			next(new ServerError(
				'The worktypeID is not a number',
				400,
				'trackless.checkID.NaN'
			))
		} else {
			// Get the infomation from the database
			DBcon.query(
				'SELECT * FROM `TL_worktype` WHERE `worktypeID`=?',
				[request.params.worktypeID],
				handleQuery(next, result => {
					if (result.length === 0) {
						// WorktypeID does not exsist
						next(new ServerError(
							'The worktypeID does not exsist',
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

export default worktypeIDCheckHandler
