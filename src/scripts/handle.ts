// Copyright (c) 2020 Wouter van der Wal

import { NextFunction } from 'express'
import { sqlError } from './error'
import { MysqlError } from 'mysql'
import ServerError from './RequestHandler/serverErrorInterface'

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
    if (error?.errno === 1452) { // Can not insert
      const err: ServerError = new Error('Please make sure your values are valid')
      err.status = 400
      err.code = 'trackless.reference.notFound'
      next(err)
    } else if (error && !(error?.errno === 1451 && referencedErr != null)) {
      sqlError(next, error)
    } else if (error?.errno === 1451 && referencedErr != null) { // Can not remove
      referencedErr()
    } else {
      then(result)
    }
  }
}
