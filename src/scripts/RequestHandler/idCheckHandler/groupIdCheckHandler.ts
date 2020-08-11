import { Request, Response, NextFunction } from 'express';
import { DBcon } from '../../..';
import { handleQuery } from '../../handle';
import ServerError from '../serverErrorInterface';

export default () => {
  return (request: Request, response: Response, next: NextFunction) => {
    // Check if the groupId is a number
    if (isNaN(Number(request.params.groupId))) {
      // GroupId is not correct.
      const error: ServerError = new Error('The groupId is not a number');
      error.status = 400;
      error.code = 'trackless.checkId.group.NaN';
      next(error);
    } else {
      // Get the infomation from the database
      DBcon.query("SELECT * FROM `TL_groups` WHERE `group_id`=?", [request.params.groupId], handleQuery(next, (result) => {
        if (result.length === 0) {
          // Group does not exsist
          const error: ServerError = new Error('The group does not exsist');
          error.status = 404;
          error.code = 'trackless.checkId.group.notFound';
          next(error);
        } else {
          next();
        }
      }));
    }
  }
}