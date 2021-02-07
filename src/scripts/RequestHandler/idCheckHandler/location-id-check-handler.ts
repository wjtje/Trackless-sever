// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../../..'
import ServerError from '../../../classes/server-error'
import {handleQuery} from '../../handle'

const locationIDCheckHandler = () => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Check if the apiID is a number
		if (Number.isNaN(Number(request.params.locationID))) {
			// LocationID is not correct.
			next(new ServerError(
				'The locationID is not a number',
				400,
				'trackless.checkID.NaN'
			))
		} else {
			// Get the infomation from the database
			DBcon.query('SELECT * FROM `TL_locations` WHERE `locationID`=?', [request.params.locationID], handleQuery(next, result => {
				if (result.length === 0) {
					// The locationID does not exsist
					next(new ServerError(
						'The locationID does not exsist',
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

export default locationIDCheckHandler
