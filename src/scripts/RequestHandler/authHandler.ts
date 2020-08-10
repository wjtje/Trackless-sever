import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { userInfo } from '../interfaces';
import ServerError from './serverErrorInterface';
import { DBcon } from '../..';
import { handleQuery } from '../handle';

/**
 * An express RequestHandler to check if a user has access to a command
 * 
 * @since 0.4-beta.0
 */
export default (access: string) => {
  return (request: Request, response: Response, next: NextFunction) => {
    passport.authenticate('bearer', (error, user: userInfo) => {
      if (error) {
        // Something went wrong
        const error:ServerError = new Error('Internal server error');
        error.code = 'trackless.auth.user.failed'
        next(error);
      } else if (!user) {
        // User not found
        const error:ServerError = new Error('Forbidden');
        error.status = 403;
        error.code = 'trackless.auth.user.notFound';
        next(error);
      } else {
        // Check if the user has all the rights to access that command
        DBcon.query("SELECT `access_id` FROM `TL_access` WHERE `access`=? AND `group_id`=?", [access, user.group_id], handleQuery(next, (result) => {
          if (result.length === 0 && user.group_id !== 1) {
            // User does not have access
            const error:ServerError = new Error('Forbidden');
            error.status = 403;
            error.code = 'trackless.auth.user.noAccess';
            next(error);
          } else {
            // User has access
            request.user = user;
            next();
          }
        }));
      }
    })(request, response, next);
  }
}