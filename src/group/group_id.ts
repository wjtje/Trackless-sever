import Api from "../scripts/api";
import { string, number } from "../scripts/types";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseNotFound, responseDone, responseBadRequest } from "../scripts/response";
import * as _ from 'lodash';
import { Request, Response, response } from 'express';

/**
 * Custom function for reporting to the user that group_id is wrong
 * 
 * @since 0.2-beta.1
 * @param res 
 * @param req 
 */
function wrongType(request:Request, response:Response) {
  responseBadRequest(response, {
    error: {
      message: `Please check the documentation. group_id needs to be a number and not a ${typeof request.params.group_id}.`
    }
  });
}

new Api({
  url: '/group/:group_id',
  auth: true,
  require: {
    patch: [
      {name: 'groupName', check: string},
    ],
  },
  get: (request, response) => {
    if (number(request.params.group_id)) {
      // Get all the basic information from the group
      DBcon.query(
        "SELECT * FROM `TL_groups` WHERE `group_id`=? ORDER BY `groupname`",
        [request.params.group_id],
        handleQuery(response, (resultGroup) => {
          if (resultGroup.length === 0) {
            // Group does not exsist
            responseNotFound(response);
          } else {
            // Get all users
            DBcon.query(
              "SELECT `user_id`, `firstname`, `lastname`, `username` FROM `TL_users` WHERE `group_id`=?",
              [request.params.group_id],
              handleQuery(response, (result) => {
                responseDone(response, {
                  length: resultGroup.length,
                  result: [
                    {
                      group_id: Number(request.params.group_id),
                      groupName: _.get(resultGroup, '[0].groupName', 'undefined'),
                      users: result
                    },
                  ],
                })
              })
            );
          }
        })
      );
    } else {
      // Group_id is not a number
      wrongType(request, response);
    }
  },
  delete: (request, response) => {
    if (number(request.params.group_id)) {
      DBcon.query(
        "DELETE FROM `TL_groups` WHERE `group_id`=?",
        [request.params.group_id],
        handleQuery(response, () => {
          // Remove all the users from that group
          DBcon.query(
            "UPDATE `TL_users` SET `group_id`=0 WHERE `group_id`=?",
            [request.params.group_id]
          );
  
          responseDone(response);
        })
      );
    } else {
      // Group_id is not a number
      wrongType(request, response);
    }
  },
  patch: (request, response) => {
    if (number(request.params.group_id)) {
      DBcon.query(
        "SELECT * FROM `TL_groups` WHERE `group_id`=? ORDER BY `groupname`",
        [request.params.group_id],
        handleQuery(response, (result) => {
          if (result.length === 0) {
            // The group does not exsist
            responseNotFound(response);
          } else {
            DBcon.query(
              "UPDATE `TL_groups` SET `groupName`=? WHERE `group_id`=?",
              [
                request.body.groupName,
                request.params.group_id
              ],
              handleQuery(response, () => {
                responseDone(response);
              })
            );
          }
        })
      );
    } else {
      // Group_id is not a number
      wrongType(request, response);
    }
  }
});

new Api({
  url: '/group/:group_id/add/:user_id',
  auth: true,
  post: (request, response) => {
    if (number(request.params.group_id) && number(request.params.user_id)) {
      // Check if the group and user exsist
      DBcon.query("SELECT `user_id` FROM `TL_users` WHERE user_id=?", [request.params.user_id], handleQuery(response, (resultUser) => {
        if (resultUser.length === 0) {
          responseNotFound(response);
        } else {
          DBcon.query("SELECT `group_id` FROM `TL_group` WHERE group_id=?", [request.params.group_id], handleQuery(response, (resultGroup) => {
            if (resultGroup.length === 0) {
              responseNotFound(response);
            } else {
              // Add the user to the group
              DBcon.query(
                "UPDATE `TL_users` SET `group_id`=? WHERE `user_id`=?",
                [
                  request.params.group_id,
                  request.params.user_id
                ],
                handleQuery(response, () => {
                  responseDone(response);
                })
              );
            }
          }))
        }
      }));
    } else {
      // The group_id or user_id is not a number
      responseBadRequest(response, {
        error: {
          message: 'Please check the documentation'
        }
      });
    }
  }
})