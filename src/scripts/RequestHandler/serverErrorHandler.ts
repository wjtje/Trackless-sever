// Copyright (c) 2020 Wouter van der Wal

import { Request, Response, NextFunction } from 'express'
import ServerError from './serverErrorInterface'

export default () => {
  return (error:ServerError, request:Request, response:Response, next:NextFunction) => {
    response.status(error.status || 500).json({
      message: error.message,
      code: error.code || 'trackless.unknownError'
    })

    next()
  }
}
