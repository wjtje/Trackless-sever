// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import _ from 'lodash'
import {requireObject} from './interface'
import ServerError from './server-error-interface'

/**
 * An express RequestHandler to check if a user has given all the required info
 *
 * @since 0.4-beta.0
 */
const requireHandler = (require: requireObject[]) => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Run everything async for more speed
		Promise.all(require.map(async i => {
			return new Promise((resolve, reject) => {
				if (!_.has(request.body, i.name)) {
					// It is missing
					reject(new Error(`missing: ${i.name}`))
				} else if (i.check(_.get(request.body, i.name))) {
					// The given value is correct
					resolve(null)
				} else {
					// Something is wrong with that value
					reject(new Error(`wrong: ${i.name}`))
				}
			})
		})).then(() => {
			next()
		}).catch((error_: Error) => {
			// The user is missing something
			const error: ServerError = new Error(error_.message)
			error.status = 400
			error.code = 'trackless.require.failed'
			next(error)
		})
	}
}

export default requireHandler
