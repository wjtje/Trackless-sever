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
    if (typeof request.query?.sort !== 'string') {
      request.querySort = ''
      next()
    } else {
      // Check if all the options are valid
      const userInput = request.query?.sort.replace(/ /g, '').split(',')

      let sql = ' ORDER BY '

      try {
        userInput.forEach(value => {
          // Check if the value is allows
          if (options.includes(value)) {
            sql += `${value},`
          } else {
            // The options is not allowed
            // Show an error to the user
            const error: ServerError = new Error('Wrong sort option')
            error.code = 'trackless.sort.wrong'
            error.status = 400
            throw error
          }
        })

        // Make the sql correct
        request.querySort = sql.slice(0, -1)
        next()
      } catch (error) {
        // Catch the error
        next(error)
      }
    }
  }
}
