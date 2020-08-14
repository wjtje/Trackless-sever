import { Request, Response, NextFunction } from 'express';
import { DBcon } from '../../..';
import { handleQuery } from '../../handle';
import ServerError from '../serverErrorInterface';

export default () => {
  return (request: Request, response: Response, next: NextFunction) => {
    // Check if the apiId is a number
    if (isNaN(Number(request.params.locationId))) {
      // apiId is not correct.
      const error: ServerError = new Error('The locationId is not a number');
      error.status = 400;
      error.code = 'trackless.checkId.location.NaN';
      next(error);
    } else {
      // Get the infomation from the database
      DBcon.query("SELECT * FROM `TL_locations` WHERE `location_id`=?", [request.params.locationId], handleQuery(next, (result) => {
        if (result.length === 0) {
          // The apikey does not exsist
          const error: ServerError = new Error('The locationId does not exsist');
          error.status = 404;
          error.code = 'trackless.checkId.location.notFound';
          next(error);
        } else {
          next();
        }
      }));
    }
  }
}