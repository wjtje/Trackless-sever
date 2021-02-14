import {NextFunction, Request, Response} from 'express'
import _ from 'lodash'
import ServerError from '../classes/server-error'

/**
 * Test an array with values against request.body
 *
 * If something is missing it will be returned to the user
 */
const requireHandler = (required: requireObject[]) => {
	return (request: Request, response: Response, next: NextFunction) => {
		// A array for missing items
		const missing: string[] = []
		const wrongType: string[] = []

		// Test all the required values
		required.forEach(({name, check}) => {
			// Check if it is inside the body
			if (_.has(request.body, name)) {
				// Check if the value has the correct type
				if (!check(_.get(request.body, name))) {
					wrongType.push(name)
				}
			} else {
				missing.push(name)
			}
		})

		// Check if something is missing or wrong
		if (missing.length === 0 && wrongType.length === 0) {
			next()
		} else {
			// Give the result back to the user
			next(new ServerError(
				`Some required values are missing or not correct, missing: ${JSON.stringify(missing)}, wrong: ${JSON.stringify(wrongType)}`,
				400,
				'trackless.require.failed'
			))
		}
	}
}

export default requireHandler
