import {NextFunction, Request, Response} from 'express'
import _, {result} from 'lodash'
import ServerError from '../classes/server-error'
import databaseQuery from '../database/query'

/**
 * IDChecker check if a given idName is in the request.params and if it exsist
 * in the database
 *
 * @param idName The id name (used for getting the id value out of the request)
 * @param tableName The table name (used for checking if the id is valid)
 */
const idChecker = (idName: string, tableName: string) => {
	return async (request: Request, response: Response, next: NextFunction) => {
		// Get the id value from the request
		const id = _.get(request.params, idName)

		// Check if the id is a valid number
		if (Number.isNaN(Number(id))) {
			next(new ServerError(
				`The ${idName} is not a number`,
				400,
				'trackless.checkID.NaN'
			))
		} else {
			try {
				// Get the information from the database
				const DBresult = await databaseQuery(
					request.database.connection,
					`SELECT * FROM \`${tableName}\` WHERE \`${idName}\`=?`,
					[id]
				)

				// Check the result
				if (DBresult.length === 0) {
					next(new ServerError(
						`The ${idName} does not exsist`,
						404,
						'trackless.checkID.notFound'
					))
				} else {
					next()
				}
			} catch (error: unknown) {
				// Catch any database error's
				next(error)
			}
		}
	}
}

export default idChecker
