// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../../..'
import {handleQuery} from '../../handle'
import ServerError from '../server-error-interface'

const groupIDCheckHandler = (groupIDfunc?: (request: Request) => number) => {
	return (request: Request, response: Response, next: NextFunction) => {
		const groupID = (groupIDfunc === null || groupIDfunc === undefined) ? request.params.groupID : groupIDfunc(request)

		if (Number.isNaN(Number(groupID))) {
			// GroupID is not correct.
			const error: ServerError = new Error('The groupID is not a number')
			error.status = 400
			error.code = 'trackless.checkId.NaN'
			next(error)
		} else {
			// Get the infomation from the database
			DBcon.query('SELECT * FROM `TL_groups` WHERE `groupID`=?', [groupID], handleQuery(next, result => {
				if (result.length === 0) {
					// Group does not exsist
					const error: ServerError = new Error('The group does not exsist')
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

export default groupIDCheckHandler
