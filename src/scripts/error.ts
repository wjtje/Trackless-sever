// Copyright (c) 2020 Wouter van der Wal

import {NextFunction} from 'express'
import {MysqlError} from 'mysql'
import {DBcon, logger} from '..'
import ServerError from './RequestHandler/server-error-interface'

/**
 * Trow an sql error and save it in the database
 *
 * @since 0.2-beta.1
 * @param {NextFunction} next
 * @param {MysqlError} error
 * @param {string} errorMessage
 */
export function sqlError(next: NextFunction, error_: MysqlError) {
	// Save it in the database
	DBcon.query(
		'INSERT INTO `TL_errors` (`error_code`, `error_message`) VALUES (?,?)',
		[
			error_.errno,
			error_?.sqlMessage
		]
	)

	// Use winston to log the error
	logger.log('error', 'SQL ERROR', error_)

	// Trow a new error
	const error: ServerError = new Error('Sql error')
	error.code = 'trackless.sql.unknownError'
	next(error)
}
