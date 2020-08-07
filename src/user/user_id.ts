import Api from "../scripts/api";
import { DBcon } from "..";
import { responseDone } from "../scripts/response";
import { handleQuery } from "../scripts/handle";
import { storePassword } from "../scripts/security";
import { promisify } from 'util';
import { itemPatch, handlePatchRequest } from "../scripts/patch";
import { checkUserId } from "../scripts/idCheck";
import { usernameTaken } from "../global/language";

const query = promisify(DBcon.query).bind(DBcon);

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
      ], (key, resolve, reject) => {
        // Create a custom function for changing the user
        function changeUser() {
          DBcon.query("UPDATE `TL_users` SET `" + key + "`=? WHERE `user_id`=?", [
            request.body[key],
            (request.params.user_id == '~')? user.user_id:request.params.user_id
          ], handlePatchRequest(reject, resolve));
        }
        
        // Custom function for changing the username and password
        switch (key) {
          case "username":
            // Check if the username is used
            DBcon.query(
              "SELECT `user_id` FROM `TL_users` WHERE `username`=?",
              [request.body.username],
              (error, result) => {
                if (result.length === 0 || result[0].user_id == (request.params.user_id == '~')? user.user_id:request.params.user_id) {
                  changeUser();
                } else {
                  reject(usernameTaken);
                }
              }
            );
            break;
          case "password":
            // Update password
            const {salt, hash} = storePassword(request.body[key]);
  
            DBcon.query("UPDATE `TL_users` SET `salt_hash`=?, `hash`=? where `user_id`=?", [
              salt,
              hash,
              (request.params.user_id == '~')? user.user_id:request.params.user_id
            ], handlePatchRequest(reject, resolve));
  
            break;
          default:
            changeUser()
        }
      });
    });
  },
});