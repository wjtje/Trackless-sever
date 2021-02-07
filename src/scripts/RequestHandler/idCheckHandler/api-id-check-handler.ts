// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../../..'
import {handleQuery} from '../../handle'
import ServerError from '../server-error-interface'

const apiIDCheckHandler = () => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Check if the apiID is a number
		if (Number.isNaN(Number(request.params.apiID))) {
			// ApiID is not correct.
			const error: ServerError = new Error('The apiID is not a number')
			error.status = 400
			error.code = 'trackless.checkId.NaN'
			next(error)
		} else {
			// Get the infomation from the database
			DBcon.query('SELECT * FROM `TL_apikeys` WHERE `apiID`=?', [request.params.apiID], handleQuery(next, result => {
				if (result.length === 0) {
					// The apikey does not exsist
					const error: ServerError = new Error('The apikey does not exsist')
					error.status = 404
					error.code = 'trackless.checkId.notFound'
					next(error)
				} else {
					next()
				}
			}))
		}
	}
}

export default apiIDCheckHandler
