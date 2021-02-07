import {NextFunction, Request, Response} from 'express'
import {DBcon, logger} from '..'
import ServerError from '../classes/server-error'

/**
 * Get a database connection
 *
 * use request.database.connection.release() or closeDatabaseConnection() when you are done using it
 */
const getDatabaseConnection = () => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Get a connection to the database
		DBcon.getConnection((error, connection) => {
			// Check for any error's while connecting to the database
			if (error) {
				throw new ServerError(error.message, 500, `mysql.${error.code}`)
			}

			// Add the connection to the log
			logger.info(`Got a connection to the database (${connection.threadId ?? 'unknown'})`)

			// Add the connection to the request
			request.database = {
				connection
			}

			// Go to the next function
			next()
		})
	}
}

/**
 * Close the database connection
 */
const closeDatabaseConnection = () => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Check if there is a active database connection
		if (request.database === undefined) {
			logger.info('No active database connection')
		} else {
			// Get the connection and connection threadId
			const connection = request.database.connection
			const threadId = connection?.threadId ?? 'unknown'

			// Add the infomation to the logger
			logger.info(`Closed the connection to the database (${String(threadId)})`)

			// Release the connection
			connection?.release()
		}

		// Go to the next function
		next()
	}
}

export {getDatabaseConnection, closeDatabaseConnection}
