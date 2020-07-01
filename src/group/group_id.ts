import Api from "../scripts/api";
import { string, number } from "../scripts/types";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseNotFound, responseDone, responseBadRequest } from "../scripts/response";
import * as _ from 'lodash';
import { checkGroupId, checkUserId } from "../scripts/idCheck";

new Api({
  url: '/group/:group_id',
  auth: true,
  require: {
    patch: [
      {name: 'groupName', check: string},
    ],
  },
  get: (request, response) => {
    checkGroupId(request, response, () => {
      // Group_id is valid return the info
      DBcon.query(
        "SELECT * FROM `TL_groups` WHERE `group_id`=? ORDER BY `groupname`",
        [request.params.group_id],
        handleQuery(response, (resultGroup) => {
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
        })
      );
    });
  },
  delete: (request, response) => {
    checkGroupId(request, response, () => {
      // Group_id is valid remove it
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
    });
  },
  patch: (request, response) => {
    checkGroupId(request, response, () => {
      // Group_id is valid edit it
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
    });
  }
});

new Api({
  url: '/group/:group_id/add/:user_id',
  auth: true,
  post: (request, response) => {
    checkGroupId(request, response, () => {
      checkUserId(request, response, () => {
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
      });
    });
  }
})