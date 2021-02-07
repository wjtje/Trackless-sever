// Copyright (c) 2020 Wouter van der Wal

import {NextFunction} from 'express'
import {sqlError} from './error'
import {MysqlError} from 'mysql'
import ServerError from './RequestHandler/server-error-interface'
import {DBcon} from '..'

/**
 * A function for handling a query
 *
 * @since 0.2-beta.1
 * @param response
 * @param errorMessage
 * @param then
 * @param referencedErr
 */
export function handleQuery(next: NextFunction, then: (result: any) => void, referencedError?: () => void) {
	return (error: MysqlError | null, result: any[]) => {
		if (error?.errno !== undefined && error?.errno !== 1451) {
			const error_: ServerError = new Error('Unknown error')
			switch (error?.errno) {
				case 1216: // Can not insert (Reference error)
					error_.message = 'Please make sure your values are valid'
					error_.status = 400
					error_.code = 'trackless.reference.notFound'
					next(error_)
					break
				case 1292: // Incorrect value
					error_.message = 'Please make sure your values are valid'
					error_.status = 400
					error_.code = 'trackless.sql.insertErr'
					next(error_)
					break
				case 1452: // Can not insert
					error_.message = 'Please make sure your values are valid'
					error_.status = 400
					error_.code = 'trackless.reference.notFound'
					next(error_)
					break
				case 1062:
					error_.message = 'Duplicate entry. Please check your values.'
					error_.status = 400
					error_.code = 'trackless.duplicate.err'
					next(error_)
					break
				default:
					// Save the error
					DBcon.query(
						'INSERT INTO `TL_errors` (`error_code`, `error_message`) VALUES (?,?)',
						[
							error?.errno,
							error?.sqlMessage
						]
					)

					// Report to the user
					error_.message = `An unknown sql error. (${error?.errno ?? 'unknown'})`
					error_.status = 500
					error_.code = 'trackless.sql.unknown'
					next(error_)
			}
		} else if (error && !(error?.errno === 1451 && (referencedError !== null && referencedError !== undefined))) { // Remove reference error
			sqlError(next, error)
		} else if (error?.errno === 1451 && (referencedError !== null && referencedError !== undefined)) { // Remove reference error with custom function
			referencedError()
		} else {
			then(result)
		}
	}
}
