// Copyright (c) 2020 Wouter van der Wal

import { Request, Response, NextFunction } from 'express'
import { bodyOnlyContains } from '../dataCheck'
import ServerError from './serverErrorInterface'
import { DBcon } from '../..'
import { requireObject } from './interface'
import { MysqlError, PoolConnection } from 'mysql'

export function patchHandler (editArray: requireObject[], commitFunction: (resolve: (value?: any) => void, reject: (value?: any) => void, key: string, request: Request, connection: PoolConnection) => void) {
  return (request: Request, response: Response, next: NextFunction) => {
    // Make sure the array does not contain any wrong thing
    bodyOnlyContains(request.body, editArray).then(() => {
      // Create a connection
      DBcon.getConnection((error, connection) => {
        // Start a transaction
        connection.query('START TRANSACTION')
  
        // Run all changes
        Promise.all(Object.keys(request.body).map((key: string) => {
          return new Promise((resolve, reject) => {
            commitFunction(resolve, reject, key, request, connection)
          })
        })).then(() => {
          // Save the changes
          connection.query('COMMIT')
          connection.release()
          response.status(200).json({
            message: 'saved'
          })
        }).catch((error) => {
          connection.query('ROLLBACK')
          connection.release()
          next(error)
        })
      })  
    }).catch(() => {
      // Something wrong in the array
      const error: ServerError = new Error('Please check the documentation')
      error.status = 400
      error.code = 'trackless.patch.bodyError'
      next(error)
    })
  }
}

export function handlePatchQuery (reject: (value?: any) => void, resolve: (value?: any) => void) {
  return (err: MysqlError | null) => {
    if (err) {
      const error: ServerError = new Error('Something went wrong while trying to save. Are your ID\'s correct')
      error.code = 'trackless.patch.saveError'
      reject(error)
    } else {
      resolve()
    }
  }
}
