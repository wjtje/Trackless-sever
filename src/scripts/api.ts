import { apiObject, RequestLocal } from './interfaces';
import { server } from '..';
import { Request, Response } from 'express';
import { responseBadRequest, responseForbidden } from './response';
import * as passport from "passport";
import { requiredDataCheck } from './dataCheck';
import * as _ from "lodash";
import { checkAccess } from '../access/lib';
import { missingError } from './error';

// Create the api class
export default class Api {
  /**
   * Creates a new api function
   * 
   * @since 0.2-beta.1
   * @param apiObject The object with all the details for your api call.
   * @example
   * 
   * new Api({
   *  url: "/welcome",
   *  get: (request, response, userInfo) => {
   *    response.send(`Welcome ${userInfo.firstname} ${userInfo.lastname}`);
   *  },
   *  require: [],
   *  auth: true,
   *  permissions: {
   *    get: [
   *      user.readOwnInfo
   *    ]
   *  }
   * })
   */
  constructor (private apiObject:apiObject) {
    // Create a router function
    const routeFunction = (request:RequestLocal, response:Response) => {
      // Check if the method exsist on that route
      if (this.apiObject[request.method.toLowerCase()] == undefined) {
        responseBadRequest(response, {
          error: {
            message: `There is no method '${request.method}' on '${this.apiObject.url}'`,
          },
        });
      } else {
        requiredDataCheck(request, response, _.get(this.apiObject.require, request.method.toLowerCase(), [])).then(() => {
          // Do we need auth?
          if (this.apiObject.auth) {
            checkAccess(request.user.group_id, request.method.toLowerCase(), (function(apiObject) {
              // Check if the user want to list his own stuff
              if (_.get(request.params, 'user_id', 'none') === '~') {
                // Replace :user_id with ~
                return apiObject.url.replace(':user_id', '~');
              } else if (_.get(request.params, 'group_id', 'none') === '~') {
                // Replace :group_id with ~
                return apiObject.url.replace(':group_id', '~');
              } else {
                return apiObject.url;
              }
            })(this.apiObject)).then(() => {
              // Run the request
              this.apiObject[request.method.toLowerCase()](request, response, request.user);
            }).catch(() => {
              responseForbidden(response);
            });
          } else {
            this.apiObject[request.method](request, response);
          }
        }).catch(([missing, typeErr]) => {
          // Something is missing report to the user
          missingError(response, missing, typeErr);
        });
      }
    }

    // Custom functions for adding passport
    const passportCheck = passport.authenticate('bearer', { session: false });

    // Create a new route
    if (this.apiObject.auth) {
        server.route(this.apiObject.url)
          .get(passportCheck, routeFunction)
          .post(passportCheck, routeFunction)
          .patch(passportCheck, routeFunction)
          .delete(passportCheck, routeFunction)
    } else {
      server.route(this.apiObject.url)
        .get(routeFunction)
        .post(routeFunction)
        .patch(routeFunction)
        .delete(routeFunction)
    }
  }
}