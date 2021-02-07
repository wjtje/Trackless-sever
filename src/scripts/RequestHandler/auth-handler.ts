// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import passport from 'passport'
import {userInfo} from './interface'
import ServerError from './server-error-interface'
import {DBcon} from '../..'
import {handleQuery} from '../handle'

type accessFunction = (request: Request) => string

/**
 * An express RequestHandler to check if a user has access to a command
 *
 * @since 0.4-beta.0
 */
const authHandler = (access: accessFunction | string) => {
	return (request: Request, response: Response, next: NextFunction) => {
		passport.authenticate('bearer', (error, user: userInfo) => {
			if (error) {
				// Something went wrong
				const error: ServerError = new Error('Internal server error')
				error.code = 'trackless.auth.user.failed'
				next(error)
			} else if (user) {
				// Check if the user has all the rights to access that command
				DBcon.query(
					'SELECT `accessID` FROM `TL_access` WHERE `access`=? AND `groupID`=?',
					[
						(typeof access === 'string') ? access : access(request),
						user.groupID
					], handleQuery(next, result => {
						if (result.length === 0 && user.groupID !== 1) {
							// User does not have access
							const error: ServerError = new Error('Forbidden')
							error.status = 403
							error.code = 'trackless.auth.user.noAccess'
							next(error)
						} else {
							// User has access
							request.user = user
							next()
						}
					})
				)
			} else {
				// User not found
				const error: ServerError = new Error('Forbidden')
				error.status = 401
				error.code = 'trackless.auth.user.notFound'
				next(error)
			}
		})(request, response, next)
	}
}

export default authHandler
