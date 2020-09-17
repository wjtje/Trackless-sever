// Copyright (c) 2020 Wouter van der Wal

import { Request, Response, NextFunction } from 'express'
import moment from 'moment'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import ServerError from '../../scripts/RequestHandler/serverErrorInterface'

export default () => {
  return (request: Request, response: Response, next: NextFunction) => {
    // Custom function for checking if you are allowed to edit this
    DBcon.query(
      'SELECT `date` FROM `TL_work` where `workId`=?',
      [request.params.workId],
      handleQuery(next, (result) => {
        // Check if the user is allowed to add work
        if (response.locals.setting?.workLateDays == null) {
          next()
        } else if (moment(result[0].date).isAfter(moment().subtract(Number(response.locals.setting.workLateDays), 'days'))) {
          next()
        } else {
          const error: ServerError = new Error('You are not allowed to save work')
          error.code = 'trackless.work.toLate'
          error.status = 400
          next(error)
        }
      })
    )
  }
}
