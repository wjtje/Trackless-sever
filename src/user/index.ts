import Api from "../scripts/api";
import { DBcon } from "..";
import { responseDone } from "../scripts/response";
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

/**
 * @oas [get] /user
 * description: "Returns all users from the system."
 */
/**
 * @oas [post] /user
 * description: "Creates a new user"
 */
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
  permissions: {

  },
  get: (request, response) => {
    DBcon.query(
      "SELECT `user_id`, `firstname`, `lastname`, `username`, `group_id`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`group_id`) ORDER BY `firstname`, `lastname`, `username`",
      handleQuery(response, 'Couldn\'t select all the users.', (result: Array<TL_user>) => {
        responseDone(response, {
          result: result
        })
      })
    );
  },
  post: (request, response) => {
    // Check if the user is taken
    DBcon.query(
      "SELECT `username` FROM `TL_users` WHERE `username`=?",
      [ request.body.username ],
      handleQuery(response, `Something went wrong while checking the username = '${request.body.username}'`, (result) => {
        if (result.length > 0) { // Username is taken
          response.status(400);

          response.send(JSON.stringify({
            status: 400,
            message: 'Username is taken.',
          }));
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
            handleQuery(response, 'Couldn\'t save the user into the database. Please try again later', (result) => {
              // User has been created
              responseDone(response, {
                user_id: result.insertId
              });
            })
          );
        }
      })
    );
  }
});