import Api from "../scripts/api";
import { DBcon } from "..";
import { responseDone, responseBadRequest, responseCreated } from "../scripts/response";
import { string, number } from '../scripts/types';
import { storePassword } from "../scripts/security";
import { handleQuery } from "../scripts/handle";

interface TL_user {
  user_id:   number;
  firstname: string;
  lastname:  string;
  username:  string;
  group_id:  number;
  groupName: string;
}

new Api({
  url: "/user",
  auth: true,
  require: {
    post: [
      {name: "firstname", check: string},
      {name: "lastname", check: string},
      {name: "username", check: string},
      {name: "password", check: string},
      {name: "group_id", check: number},
    ]
  },
  get: (request, response) => {
    DBcon.query(
      "SELECT `user_id`, `firstname`, `lastname`, `username`, `group_id`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`group_id`) ORDER BY `firstname`, `lastname`, `username`",
      handleQuery(response, (result: Array<TL_user>) => {
        responseDone(response, {
          length: result.length,
          result: result,
        });
      })
    );
  },
  post: (request, response) => {
    // Check if the user is taken
    DBcon.query(
      "SELECT `username` FROM `TL_users` WHERE `username`=?",
      [ request.body.username ],
      handleQuery(response, (result) => {
        if (result.length > 0) { // Username is taken
          responseBadRequest(response, {
            error: {
              message: `the username is already taken. Please choose an other one.`
            }
          });
        } else {  // Every things good
          // Create a new user
          const {salt, hash} = storePassword(request.body.password);

          // Commit to the database
          DBcon.query(
            "INSERT INTO `TL_users` ( `firstname`, `lastname`, `username`, `group_id`, `salt_hash`, `hash` ) VALUES ( ?, ?, ?, ?, ?, ?)",
            [
              request.body.firstname,
              request.body.lastname,
              request.body.username,
              Number(request.body.group_id),
              salt,
              hash
            ],
            handleQuery(response, (result) => {
              // User has been created
              responseCreated(response, {
                user_id: result.insertId
              });
            })
          );
        }
      })
    );
  }
});