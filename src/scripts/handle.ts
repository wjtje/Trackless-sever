// Copyright (c) 2020 Wouter van der Wal

import { NextFunction } from 'express'
import { sqlError } from './error'
import { MysqlError } from 'mysql'
import ServerError from './RequestHandler/serverErrorInterface'
import { DBcon } from '..'

/**
 * A function for handling a query
 *
 * @since 0.2-beta.1
 * @param response
 * @param errorMessage
 * @param then
 * @param referencedErr
 */
export function handleQuery (next: NextFunction, then: (result: any) => void, referencedErr?: () => void) {
  return (error: MysqlError | null, result: any[]) => {
    if (error?.errno != null && error.errno !== 1451) {
      const err: ServerError = new Error()
      switch (error.errno) {
        case 1216: // Can not insert (Reference error)
          err.message = 'Please make sure your values are valid'
          err.status = 400
          err.code = 'trackless.reference.notFound'
          next(err)
          break
        case 1292: // Incorrect value
          err.message = 'Please make sure your values are valid'
          err.status = 400
          err.code = 'trackless.sql.insertErr'
          next(err)
          break
        case 1452: // Can not insert
          err.message = 'Please make sure your values are valid'
          err.status = 400
          err.code = 'trackless.reference.notFound'
          next(err)
          break
        case 1062:
          err.message = 'Duplicate entry. Please check your values.'
          err.status = 400
          err.code = 'trackless.duplicate.err'
          next(err)
          break
        default:
          // Save the error
          DBcon.query(
            'INSERT INTO `TL_errors` (`error_code`, `error_message`) VALUES (?,?)',
            [
              error.errno,
              error.sqlMessage
            ]
          )

          // Report to the user
          err.message = `An unknown sql error. (${error.errno})`
          err.status = 500
          err.code = 'trackless.sql.unknown'
          next(err)
      }
    } else if (error && !(error?.errno === 1451 && referencedErr != null)) { // Remove reference error
      sqlError(next, error)
    } else if (error?.errno === 1451 && referencedErr != null) { // Remove reference error with custom function
      referencedErr()
    } else {
      then(result)
    }
  }
}
