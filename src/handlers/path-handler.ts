import {NextFunction, Request, Response} from 'express'
import _ from 'lodash'
import {logger} from '..'
import ServerError from '../classes/server-error'

/**
 * This function will check the body for any items that aren't allowed
 *
 * It will return an array with keys that aren't allowd and
 * an array with keys that aren't the right type
 *
 * @param body The request body to check
 * @param editArray The array of allowed values
 * @returns The two array. If both are empty then nothing wrong has been found
 */
const arrayCheck = (body: Request['body'], editArray: requireObject[]): {
	/**
	 * This array contains keys that where provided by the user that
	 * are not allowed by the system
	 */
	notAllowed: string[];
	/**
	 * This array contains keys that didn't complete the type check
	 */
	wrongType: string[];
} => {
	const notAllowed: string[] = []
	const wrongType: string[] = []

	// Check all the keys
	Object.keys(body).forEach(item => {
		// Get the index of the item in the editArray
		const index = _.findIndex(editArray, ['name', item])

		// Check if the value is found
		if (index === -1) {
			notAllowed.push(item)
		} else if (!editArray[index].check(body[item])) {
			wrongType.push(item)
		}
	})

	// Return the results
	return {
		notAllowed,
		wrongType
	}
}

/**
 * A request handler that makes patch a object easy
 *
 * It will check if the request.body is valid and update all
 * items use the commitFunction
 *
 * @param editArray A array of items that are allowed to be edited
 * @param commitFunction A function that will be run when a change needs to be saved
 */
const patchHandler = (
	editArray: requireObject[],
	commitFunction: (
		/**
		 * Run this function when the value was saved succesfully
		 */
		resolve: (value?: any) => void,

		/**
		 * Run this function when something gone wrong
		 */
		reject: (reason?: any) => void,

		/**
		 * The key of the value that going to be changes
		 */
		key: string,

		/**
		 * The request from the user
		 */
		request: Request
	) => Promise<void>
) => {
	return (request: Request, response: Response, next: NextFunction) => {
		// Check the array
		const {notAllowed, wrongType} = arrayCheck(request.body, editArray)

		// Check if there is a connection to the database
		if (request.database.connection === undefined) {
			logger.error('PatchHandler doesn\'t have a database connection')
			next(new ServerError(
				'No database connection'
			))
		} else if (notAllowed.length > 0 || wrongType.length > 0) {
			next(new ServerError(
				`The provided values aren't valid. Not allowed: '${JSON.stringify(notAllowed)}', wrong type: '${JSON.stringify(wrongType)}'`,
				400,
				'trackless.patch.bodyError'
			))
		} else {
			// Start a transaction
			request.database.connection.query('START TRANSACTION')

			// Make all the changes
			Promise.all(Object.keys(request.body).map(async key => {
				return new Promise((resolve, reject) => {
					void commitFunction(resolve, reject, key, request)
				})
			}))
				.then(() => {
					// Commit the changes
					request.database.connection?.query('COMMIT')

					response.status(200).json({
						message: 'saved'
					})
				})
				.catch(error => {
					// Restore the changes
					request.database.connection?.query('ROLLBACK')

					next(error)
				})
		}
	}
}

export default patchHandler
