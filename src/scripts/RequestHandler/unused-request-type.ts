// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import ServerError from '../../classes/server-error'

export default function unusedRequestTypes() {
	return (request: Request, response: Response, next: NextFunction) => {
		next(new ServerError(
			'This request type does not exists on that route',
			404,
			'trackless.router.requestError'
		))
	}
}
