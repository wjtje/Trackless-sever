// Copyright (c) 2020 Wouter van der Wal

import { Request, Response, NextFunction } from 'express'
import { DBcon } from '../../..'
import { handleQuery } from '../../handle'
import ServerError from '../serverErrorInterface'

export default () => {
  return (request: Request, response: Response, next: NextFunction) => {
    // Check if the userID is a number
    if (isNaN(Number(request.params.userID)) && request.params.userID !== '~') {
      // userID is not correct.
      const error: ServerError = new Error('The userID is not a number')
      error.status = 400
      error.code = 'trackless.checkId.NaN'
      next(error)
    } else {
      // Get the infomation from the database
      DBcon.query(
        'SELECT * FROM `TL_users` WHERE `userID`=?',
        [(request.params.userID === '~') ? request.user?.userID : request.params.userID],
        handleQuery(next, (result) => {
          if (result.length === 0) {
            // Group does not exsist
            const error: ServerError = new Error('The user does not exsist')
            error.status = 404
            error.code = 'trackless.checkId.notFound'
            next(error)
          } else {
            next()
          }
        })
      )
    }
  }
}
