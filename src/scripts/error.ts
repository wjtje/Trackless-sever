// Copyright (c) 2020 Wouter van der Wal

import { NextFunction } from 'express'
import { MysqlError } from 'mysql'
import { DBcon, logger } from '..'
import ServerError from './RequestHandler/serverErrorInterface'

/**
 * Trow an sql error and save it in the database
 *
 * @since 0.2-beta.1
 * @param {NextFunction} next
 * @param {MysqlError} error
 * @param {string} errorMessage
 */
export function sqlError (next: NextFunction, err: MysqlError) {
  // Save it in the database
  DBcon.query(
    'INSERT INTO `TL_errors` (`error_code`, `error_message`) VALUES (?,?)',
    [
      err.errno,
      err?.sqlMessage
    ]
  )

  // Use winston to log the error
  logger.log('error', 'SQL ERROR', err)

  // Trow a new error
  const error: ServerError = new Error('Sql error')
  error.code = 'trackless.sql.unknownError'
  next(error)
}
