import Api from "../scripts/api";
import { string, number } from "../scripts/types";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseNotFound, responseDone } from "../scripts/response";
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
  response.status(400);
  response.send(JSON.stringify({
    status: 400,
    message: `Please check the documentation. group_id needs to be a number and not a ${typeof request.params.group_id}.`
  }));
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
        handleQuery(response, `Could not list the group. Does it exsist?`, (resultGroup) => {
          if (resultGroup.length === 0) {
            responseNotFound(response);
          } else {
            // Get all users
            DBcon.query(
              "SELECT `user_id`, `firstname`, `lastname`, `username` FROM `TL_users` WHERE `group_id`=?",
              [request.params.group_id],
              handleQuery(response, `Could not find any users.`, (result) => {
                responseDone(response, {
                  result: {
                    group_id: Number(request.params.group_id),
                    groupName: _.get(resultGroup, '[0].groupName', 'undefined'),
                    users: result
                  }
                })
              })
            );
          }
        })
      );
    } else {
      wrongType(request, response);
    }
  },
  delete: (request, response) => {
    if (number(request.params.group_id)) {
      DBcon.query(
        "DELETE FROM `TL_groups` WHERE `group_id`=?",
        [request.params.group_id],
        handleQuery(response, `Could not list the group. Does it exsist?`, () => {
          // Remove all the users from that group
          DBcon.query(
            "UPDATE `TL_users` SET `group_id`=0 WHERE `group_id`=?",
            [request.params.group_id]
          );
  
          responseDone(response);
        })
      );
    } else {
      wrongType(request, response);
    }
  },
  patch: (request, response) => {
    if (number(request.params.group_id)) {
      DBcon.query(
        "UPDATE `TL_groups` SET `groupName`=? WHERE `group_id`=?",
        [
          request.body.groupName,
          request.params.group_id
        ],
        handleQuery(response, `Could not save the change`, () => {
          responseDone(response);
        })
      );
    } else {
      wrongType(request, response);
    }
  }
});

/**
 * @oas [post] /group/:group_id/:user_id
 * description: "Add a user to a group."
 */
new Api({
  url: '/group/:group_id/:user_id',
  auth: true,
  post: (request, response) => {
    if (number(request.params.group_id) && number(request.params.user_id)) {
      // Add the user to the group
      DBcon.query(
        "UPDATE `TL_users` SET `group_id`=? WHERE `user_id`=?",
        [
          request.params.group_id,
          request.params.user_id
        ],
        handleQuery(response, `Could not save the change`, () => {
          responseDone(response);
        })
      );
    } else {
      // The group_id or user_id is not a number
      response.status(400);
      response.send(JSON.stringify({
        status: 400,
        message: `Please check the documentation.`
      }));
    }
  }
})