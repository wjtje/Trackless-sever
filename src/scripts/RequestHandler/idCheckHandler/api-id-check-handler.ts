// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../../..'
import ServerError from '../../../classes/server-error'
import {handleQuery} from '../../handle'

const apiIDCheckHandler = () => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Check if the apiID is a number
		if (Number.isNaN(Number(request.params.apiID))) {
			// ApiID is not correct.
			next(new ServerError(
				'The apiID is not a number',
				400,
				'trackless.checkID.NaN'
			))
		} else {
			// Get the infomation from the database
			DBcon.query('SELECT * FROM `TL_apikeys` WHERE `apiID`=?', [request.params.apiID], handleQuery(next, result => {
				if (result.length === 0) {
					// The apiID does not exsist
					next(new ServerError(
						'The apiID does not exsist',
						404,
						'trackless.checkID.notFound'
					))
				} else {
					next()
				}
			}))
		}
	}
}

export default apiIDCheckHandler
