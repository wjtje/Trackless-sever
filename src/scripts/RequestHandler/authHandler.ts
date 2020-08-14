import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { userInfo } from './interface';
import ServerError from './serverErrorInterface';
import { DBcon } from '../..';
import { handleQuery } from '../handle';

type accessFunction = (request: Request) => string

/**
 * An express RequestHandler to check if a user has access to a command
 * 
 * @since 0.4-beta.0
 */
export default (access: accessFunction | string) => {
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
        error.status = 401;
        error.code = 'trackless.auth.user.notFound';
        next(error);
      } else {
        // Check if the user has all the rights to access that command
        DBcon.query(
          "SELECT `accessId` FROM `TL_access` WHERE `access`=? AND `groupId`=?",
          [
            (typeof access === 'string')? access:access(request),
            user.groupId
          ], handleQuery(next, (result) => {
          if (result.length === 0 && user.groupId !== 1) {
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