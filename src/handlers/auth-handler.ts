import {NextFunction, Request, Response} from 'express'
import passport from 'passport'
import {logger} from '..'
import ServerError from '../classes/server-error'
import databaseQuery from '../database/query'

type accessFunction = (request: Request) => string

/**
 * An auth handler check if the user has access to the provided rule
 */
const authHandler = (access: accessFunction | string) => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Get the access string
		const accessRule = (typeof access === 'string') ? access : access(request)

		// Try to auth the user
		passport.authenticate('bearer', (error, user) => {
			// Check for any errors
			if (error) {
				logger.error(JSON.stringify({...error}))

				next(new ServerError(
					'Interal server error',
					500,
					'trackless.auth.user.failed'
				))
			} else if (user) {
				// Check if there is user data
				// Check if the user has all the rights to access that command
				databaseQuery(
					request.database?.connection,
					'SELECT `accessID` FROM `TL_access` WHERE `access`=? AND `groupID`=?',
					[
						accessRule,
						user.groupID
					]
				)
					.then(result => {
						if (result.length === 0) {
							// The user doesn't have access
							next(new ServerError(
								'Forbidden',
								403,
								'trackless.auth.user.noAccess'
							))
						} else {
							// The user has access
							// Add the user object to the request
							request.user = user
							next()
						}
					})
					.catch(next)
			} else {
				// User not found
				next(new ServerError(
					'Forbidden',
					401,
					'trackless.auth.user.notFound'
				))
			}
		})(request, response, next)
	}
}

export default authHandler
