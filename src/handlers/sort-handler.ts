import {NextFunction, Request, Response} from 'express'
import ServerError from '../classes/server-error'

/**
 * Makes the user able to sort the result of a request
 *
 * This function will fill the request.querySort with the options
 * this can be null
 */
const sortHandler = (
	/**
	 * A list of allowed options
	 */
	options: string[]
) => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Check if the user had provided any options
		if (typeof request.query?.sort === 'string') {
			// Get the provided option by the user
			const userOptions = request.query.sort.replace(/ /g, '').split(',')

			let sql = 'ORDER BY '

			try {
				userOptions.forEach(value => {
					// Check if the option is allowed
					if (options.includes(value)) {
						sql += `${value},`
					} else {
						// The option is not allowed
						throw new ServerError(
							`Sort option '${value}' is not allowed`,
							400,
							'trackless.sort.wrong'
						)
					}
				})

				// Remove the last , from the sql
				request.querySort = sql.slice(0, -1)
				next()
			} catch (error: unknown) {
				// Catch the server error
				next(error)
			}
		} else {
			// No sorting is needed
			next()
		}
	}
}

export default sortHandler
