import { Request, Response, NextFunction } from 'express';
import { DBcon } from '../../..';
import { handleQuery } from '../../handle';
import ServerError from '../serverErrorInterface';

export default () => {
  return (request: Request, response: Response, next: NextFunction) => {
    // Check if the userId is a number
    if (isNaN(Number(request.params.userId)) && request.params.userId !== '~') {
      // userId is not correct.
      const error: ServerError = new Error('The userId is not a number');
      error.status = 400;
      error.code = 'trackless.checkId.user.NaN';
      next(error);
    } else {
      // Get the infomation from the database
      DBcon.query(
        "SELECT * FROM `TL_users` WHERE `user_id`=?",
        [(request.params.userId == '~')? request.user.user_id:request.params.userId],
        handleQuery(next, (result) => {
          if (result.length === 0) {
            // Group does not exsist
            const error: ServerError = new Error('The user does not exsist');
            error.status = 404;
            error.code = 'trackless.checkId.user.notFound';
            next(error);
          } else {
            next();
          }
        }
      ));
    }
  }
}