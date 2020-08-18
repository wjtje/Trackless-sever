// Copyright (c) 2020 Wouter van der Wal

import { Request, Response, NextFunction } from 'express';
import { DBcon } from '../../..';
import { handleQuery } from '../../handle';
import ServerError from '../serverErrorInterface';

export default () => {
  return (request: Request, response: Response, next: NextFunction) => {
    // Check if the apiId is a number
    if (isNaN(Number(request.params.accessId))) {
      // apiId is not correct.
      const error: ServerError = new Error('The accessId is not a number');
      error.status = 400;
      error.code = 'trackless.checkId.access.NaN';
      next(error);
    } else {
      // Get the infomation from the database
      DBcon.query("SELECT * FROM `TL_access` WHERE `accessId`=?", [request.params.accessId], handleQuery(next, (result) => {
        if (result.length === 0) {
          // The apikey does not exsist
          const error: ServerError = new Error('The accessId does not exsist');
          error.status = 404;
          error.code = 'trackless.checkId.access.notFound';
          next(error);
        } else {
          next();
        }
      }));
    }
  }
}