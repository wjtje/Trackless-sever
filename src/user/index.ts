// Import the server and db con from index
import { DBcon } from '../index';

// Import string and scripts we need
import { handleQuery, responseDone, storePassword } from '../scripts';

// Import other modules
import * as _ from 'lodash';
import { newApi, handleReject } from '../api';

// Interfaces
export interface TL_user {
  user_id:   number;
  firstname: string;
  lastname:  string;
  username:  string;
  group_id:  number;
  groupName: string;
}

// List all users
newApi("get", '/user', [
  {name: "bearer", type: "string"}
], (_request, response) => {
  // Get all the users
  DBcon.query(
    "SELECT `user_id`, `firstname`, `lastname`, `username`, `group_id`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`group_id`)",
    handleQuery(response, 'Couldn\'t select all the users.', (result: Array<TL_user>) => {
      responseDone(response, {
        result: result
      })
    })
  );
}, handleReject());

// Create a new user
newApi("post", '/user', [
  {name: "bearer", type: "string"},
  {name: "firstname", type: "string"},
  {name: "lastname", type: "string"},
  {name: "username", type: "string"},
  {name: "password", type: "string"},
  {name: "group_id", type: "number"},
], (request, response) => {
  // Check if the user is taken
  DBcon.query(
    "SELECT `username` FROM `TL_users` WHERE `username`=?",
    [ request.body.username ],
    handleQuery(response, `Something went wrong while checking the username = '${request.body.username}'`, (result) => {
      if (result.length > 0) { // Username is taken
        response.send(JSON.stringify({
          status: 400,
          message: 'Username is taken.',
        }));

        response.status(400);
      } else {  // Every things good
        // Create a new user
        const [salt, hash] = storePassword(request.body.password);

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
}, handleReject());