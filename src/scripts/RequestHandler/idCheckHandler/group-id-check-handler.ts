// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {DBcon} from '../../..'
import ServerError from '../../../classes/server-error'
import {handleQuery} from '../../handle'

const groupIDCheckHandler = (groupIDfunc?: (request: Request) => number) => {
	return (request: Request, response: Response, next: NextFunction) => {
		const groupID = (groupIDfunc === null || groupIDfunc === undefined) ? request.params.groupID : groupIDfunc(request)

		if (Number.isNaN(Number(groupID))) {
			// GroupID is not correct.
			next(new ServerError(
				'The groupID is not a number',
				400,
				'trackless.checkID.NaN'
			))
		} else {
			// Get the infomation from the database
			DBcon.query('SELECT * FROM `TL_groups` WHERE `groupID`=?', [groupID], handleQuery(next, result => {
				if (result.length === 0) {
					// Group does not exsist
					next(new ServerError(
						'The groupID does not exsist',
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

export default groupIDCheckHandler
