import {PoolConnection} from 'mysql'
import {logger} from '..'
import ServerError from '../classes/server-error'

/**
 * Run a sql query on the database as a promise
 */
const databaseQuery = async (connection: PoolConnection | undefined, sqlCommand: string, sqlParameters: string[]): Promise<any[]> => {
	return new Promise((resolve, reject) => {
		// Check the connection
		if (connection === undefined) {
			reject(new ServerError(
				'Sql connection error',
				500,
				'trackless.sql.noConnection'
			))
		} else {
			// Run the sqlCommand
			connection.query(sqlCommand, sqlParameters, (error, result) => {
				// Check for any errors
				if (error) {
					logger.log('error', 'SQL ERROR', error)

					switch (error?.errno) {
						case 1216: // Can not insert (Reference error)
							reject(new ServerError(
								'Please make sure your values are valid',
								400,
								'trackless.reference.notFound'
							))
							break
						case 1292: // Incorrect value
							reject(new ServerError(
								'Please make sure your values are valid',
								400,
								'trackless.sql.insertErr'
							))
							break
						case 1452: // Can not insert
							reject(new ServerError(
								'Please make sure your values are valid',
								400,
								'trackless.reference.notFound'
							))
							break
						case 1062:
							reject(new ServerError(
								'Duplicate entry. Please check your values.',
								400,
								'trackless.duplicate.err'
							))
							break
						default:
							// Save the error
							connection.query(
								'INSERT INTO `TL_errors` (`error_code`, `error_message`) VALUES (?,?)',
								[
									error?.errno,
									error?.sqlMessage
								]
							)

							// Report to the user
							reject(new ServerError(
								`An unknown sql error. (${error?.errno ?? 'unknown'})`,
								500,
								'trackless.sql.unknown'
							))
					}
				} else {
					resolve(result)
				}
			})
		}
	})
}

export default databaseQuery
