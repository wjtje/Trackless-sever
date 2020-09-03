// Copyright (c) 2020 Wouter van der Wal

import { NextFunction } from 'express'
import { sqlError } from './error'
import { MysqlError } from 'mysql'

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
    if (error && !(error?.errno === 1451 && referencedErr != null)) {
      sqlError(next, error)
    } else if (error?.errno === 1451 && referencedErr != null) {
      referencedErr()
    } else {
      then(result)
    }
  }
}
