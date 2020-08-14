import { Request, Response, NextFunction } from 'express';
import { DBcon } from '../../..';
import { handleQuery } from '../../handle';
import ServerError from '../serverErrorInterface';

export default () => {
  return (request: Request, response: Response, next: NextFunction) => {
    // Check if the workId is a number
    if (isNaN(Number(request.params.workId))) {
      // workId is not correct.
      const error: ServerError = new Error('The workId is not a number');
      error.status = 400;
      error.code = 'trackless.checkId.work.NaN';
      next(error);
    } else {
      // Get the infomation from the database
      DBcon.query(
        "SELECT * FROM `TL_work` WHERE `workId`=?",
        [request.params.workId],
        handleQuery(next, (result) => {
          if (result.length === 0) {
            // Group does not exsist
            const error: ServerError = new Error('The workId does not exsist');
            error.status = 404;
            error.code = 'trackless.checkId.work.notFound';
            next(error);
          } else {
            next();
          }
        }
      ));
    }
  }
}