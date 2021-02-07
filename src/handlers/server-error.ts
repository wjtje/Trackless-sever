import {NextFunction, Request, Response} from 'express'
import {logger} from '..'
import ServerError from '../classes/server-error'

/**
 * This handler handles server error
 *
 * It will make sure that the database connection will be closed and
 * inform the user that there is an error
 */
const handleServerError = () => {
	return (error: ServerError, request: Request, response: Response, next: NextFunction) => {
		// Close any open database connection
		if (request.database !== undefined) {
			logger.info('info', 'Closing database connection due to an error')
			request.database.connection?.release()
		}

		// If this is an other error than not found add it to the log
		if (error.status !== 404) {
			logger.log('warn', error.message, error)
		}

		// Create a response for the user
		response
			.status(error.status ?? 500)
			.json({
				message: error.message,
				code: error.code ?? error.type ?? 'trackless.unknown error'
			})

		// Give the control back to express
		next()
	}
}

export default handleServerError
