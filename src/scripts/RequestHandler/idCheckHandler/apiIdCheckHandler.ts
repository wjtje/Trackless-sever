// Copyright (c) 2020 Wouter van der Wal

import { Request, Response, NextFunction } from 'express'
import { DBcon } from '../../..'
import { handleQuery } from '../../handle'
import ServerError from '../serverErrorInterface'

export default () => {
  return (request: Request, response: Response, next: NextFunction) => {
    // Check if the apiId is a number
    if (isNaN(Number(request.params.apiId))) {
      // apiId is not correct.
      const error: ServerError = new Error('The apiId is not a number')
      error.status = 400
      error.code = 'trackless.checkId.NaN'
      next(error)
    } else {
      // Get the infomation from the database
      DBcon.query('SELECT * FROM `TL_apikeys` WHERE `apiId`=?', [request.params.apiId], handleQuery(next, (result) => {
        if (result.length === 0) {
          // The apikey does not exsist
          const error: ServerError = new Error('The apikey does not exsist')
          error.status = 404
          error.code = 'trackless.checkId.notFound'
          next(error)
        } else {
          next()
        }
      }))
    }
  }
}
