// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../../..'
import ServerError from '../../../classes/server-error'
import {handleQuery} from '../../handle'

const workIDCheckHandler = () => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Check if the workID is a number
		if (Number.isNaN(Number(request.params.workID))) {
			// WorkID is not correct.
			next(new ServerError(
				'The workID is not a number',
				400,
				'trackless.checkID.NaN'
			))
		} else {
			// Get the infomation from the database
			DBcon.query(
				'SELECT * FROM `TL_work` WHERE `workID`=?',
				[request.params.workID],
				handleQuery(next, result => {
					if (result.length === 0) {
						// WorkID does not exsist
						next(new ServerError(
							'The workID does not exsist',
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

export default workIDCheckHandler
