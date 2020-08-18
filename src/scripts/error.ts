// Copyright (c) 2020 Wouter van der Wal

import { NextFunction } from 'express';
import { MysqlError } from 'mysql';
import { DBcon } from '..';
import ServerError from './RequestHandler/serverErrorInterface';

/**
 * Trow an sql error and save it in the database
 * 
 * @since 0.2-beta.1
 * @param {NextFunction} next 
 * @param {MysqlError} error 
 * @param {string} errorMessage 
 */
export function sqlError(next:NextFunction, err:MysqlError, errorMessage:string) {
  // Save it in the database
  // TODO: Add the userId to the error
  DBcon.query(
    "INSERT INTO `TL_errors` (`userId`, `error_code`, `error_message`) VALUES (?,?,?)",
    [
      0,
      err.code,
      errorMessage
    ]
  );

  // Trow a new error
  const error:ServerError = new Error('Sql error');
  error.code = 'trackless.sql.unknownError';
  next(error);
}