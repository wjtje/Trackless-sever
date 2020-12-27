// Copyright (c) 2020 Wouter van der Wal

import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'
import { requireObject } from './interface'
import ServerError from './serverErrorInterface'

/**
 * An express RequestHandler to check if a user has given all the required info
 *
 * @since 0.4-beta.0
 */
export default (require: requireObject[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    // Run everything async for more speed
    Promise.all(require.map((i) => {
      return new Promise((resolve, reject) => {
        if (!_.has(request.body, i.name)) {
          // It is missing
          reject(new Error(`missing: ${i.name}`))
        } else if (!i.check(_.get(request.body, i.name))) {
          // Something is wrong with that value
          reject(new Error(`wrong: ${i.name}`))
        } else {
          // The given value is correct
          resolve(null)
        }
      })
    })).then(() => {
      next()
    }).catch((err: Error) => {
      // The user is missing something
      const error: ServerError = new Error(err.message)
      error.status = 400
      error.code = 'trackless.require.failed'
      next(error)
    })
  }
}
