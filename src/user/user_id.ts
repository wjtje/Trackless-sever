import Api from "../scripts/api";
import { DBcon } from "..";
import { responseDone, responseBadRequest } from "../scripts/response";
import { handleQuery } from "../scripts/handle";
import { storePassword } from "../scripts/security";
import * as util from 'util';
import * as _ from 'lodash';
import { itemPatch } from "../scripts/patch";
import { checkUserId } from "../scripts/idCheck";

const query = util.promisify(DBcon.query).bind(DBcon);

export interface TL_user {
  user_id:   number;
  firstname: string;
  lastname:  string;
  username:  string;
  group_id:  number;
  groupName: string;
}

new Api({
  url: '/user/:user_id',
  auth: true,
  require: {

  },
  get: (request, response, user) => {
    checkUserId(request, response, () => {
      // Get all the infomation from the database
      DBcon.query(
        "SELECT `user_id`, `firstname`, `lastname`, `username`, `group_id`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`group_id`) WHERE `user_id`=?",
        [(request.params.user_id == '~')? user.user_id:request.params.user_id],
        handleQuery(response, (result: Array<TL_user>) => {
          // Send the data to the user
          responseDone(response, {
            length: result.length,
            result: result,
          });
        })
      );
    });
  },
  delete: (request, response, user) => {
    checkUserId(request, response, () => {
      // Remove the user
      DBcon.query(
        "DELETE FROM `TL_users` WHERE `user_id`=?",
        [(request.params.user_id == '~')? user.user_id:request.params.user_id],
        handleQuery(response, () => {
          // Delete all apikeys
          DBcon.query(
            "DELETE FROM `TL_apikeys` WHERE `user_id`=?",
            [request.params.user_id],
            handleQuery(response, () => {
              responseDone(response);
            })
          );
        })
      );
    });
  },
  patch: (request, response, user) => {
    checkUserId(request, response, () => {
      itemPatch(request, response, [
        "firstname",
        "lastname",
        "username",
        "password"
      ], async (key, request, rejectChange) => {
        // Create a custom function for changing the user
        function changeUser() {
          DBcon.query("UPDATE `TL_users` SET `" + key + "`=? WHERE `user_id`=?", [
            request.body[key],
            (request.params.user_id == '~')? user.user_id:request.params.user_id
          ], rejectChange);
        }
        
        // Custom function for changing the username and password
        switch (key) {
          case "username":
            // Check if the username is used
            const username = await query(
              "SELECT `user_id` FROM `TL_users` WHERE `username`=?",
              [ request.body.username ]
            );
  
            if (username.length > 0 && _.get(username, '[0].user_id', 0) != request.params.user_id) { // Username is taken
              responseBadRequest(response, {
                error: {
                  message: `the username is already taken. Please choose an other one.`
                }
              });
  
              rejectChange(true);
            } else {  // Every things good
              changeUser();
            }
  
            break;
          case "password":
            // Update password
            const {salt, hash} = storePassword(request.body[key]);
  
            DBcon.query("UPDATE `TL_users` SET `salt_hash`=?, `hash`=? where `user_id`=?", [
              salt,
              hash,
              (request.params.user_id == '~')? user.user_id:request.params.user_id
            ], rejectChange);
  
            break;
          default:
            changeUser()
        }
      });
    });
  },
});