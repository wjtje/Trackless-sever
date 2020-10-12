// Copyright (c) 2020 Wouter van der Wal

import { Request, Response, NextFunction } from 'express'
import ServerError from './serverErrorInterface'

/**
 * Checks if the request.query.sort is valid and will save the result in request.querySort
 *
 * @since 0.4-beta.3
 */
export default (options: string[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    // Check if the sort options is active
    if (request.query?.sort === undefined) {
      request.querySort = ''
      next()
    } else {
      // Check if the option is valid
      if (options.includes(String(request.query?.sort))) {
        // The options is valid
        request.querySort = ` ORDER BY \`${String(request.query?.sort)}\` `
        next()
      } else {
        // The option is wrong
        const error: ServerError = new Error('Wrong sort option')
        error.code = 'trackless.sort.wrong'
        error.status = 400
        next(error)
      }
    }
  }
}
