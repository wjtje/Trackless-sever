// Import the server and db con from index
import { DBcon } from '../index';

// Import string and scripts we need
import { handleQuery, responseDone, arrayContainOnly, storePassword, responseNotFound } from '../scripts';

// Import other modules
import * as _ from 'lodash';
import { apiError } from '../language';
import { handleReject, newApi } from '../api';
import util = require('util');
const query = util.promisify(DBcon.query).bind(DBcon);

// Interfaces
export interface TL_user {
  user_id:   number;
  firstname: string;
  lastname:  string;
  username:  string;
  group_id:  number;
  groupName: string;
}

// Get a user
newApi("get", '/user/:user_id', [
  {name: "bearer", type: "string"}
], (request, response) => {
  // Get all the infomation from the database
  DBcon.query(
    "SELECT `user_id`, `firstname`, `lastname`, `username`, `group_id`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`group_id`) WHERE `user_id`=?",
    [(request.params.user_id == '~')? request.user.user_id:request.params.user_id],
    handleQuery(response, `Couldn't find the user '${request.params.user_id}'`, (result: Array<TL_user>) => {
      if (result.length === 0) {
        responseNotFound(response);
      } else {
        // Send the data to the user
        responseDone(response, {
          result: result
        })
      }
    })
  );
}, handleReject());

// Delete a user from the system
newApi("delete", '/user/:user_id', [
  {name: "bearer", type: "string"}
], (request, response) => {
  // Send the command to the database
  DBcon.query(
    "DELETE FROM `TL_users` WHERE `user_id`=?",
    [(request.params.user_id == '~')? request.user.user_id:request.params.user_id],
    handleQuery(response, `Couldn't delete the user '${request.params.user_id}'`, () => {
      // Delete all apikeys
      DBcon.query(
        "DELETE FROM `TL_apikeys` WHERE `user_id`=?",
        [request.params.user_id]
      );

      // Done
      responseDone(response);
    })
  );
}, handleReject());

// Update a users info
newApi("patch", '/user/:user_id', [
  {name: "bearer", type: "string"}
], (request, response) => {
  // Check if there are no bad values
  let objectKeys = Object.keys(request.body);
  const searchArray = [
    "firstname",
    "lastname",
    "username",
    "password",
  ];

  arrayContainOnly(objectKeys, searchArray).then(() => {
    // Run the function async
    const updateUser = new Promise((resolve, reject) => {
      let hasFailed = false;

      // Custom function for rejecting the change
      const rejectChange = (error) => {
        if (error) {
          // Could not save it
          hasFailed = true;
          reject(' (SAVE ERR)');

          // Save the error
          DBcon.query(
            "INSERT INTO `TL_errors` (`sqlError`) VALUES (?)",
            [
              JSON.stringify(error)
            ]
          );
        }
      };

      // Custom function for chaning user
      function changeUser(key: string, req, rejectChange: (error: any) => void) {
        DBcon.query("UPDATE `TL_users` SET `" + key + "`=? WHERE `user_id`=?", [
          req.body[key],
          (request.params.user_id == '~')? request.user.user_id:request.params.user_id
        ], rejectChange);
      }

      // Change each key
      async function changeKey() {
        await Promise.all(objectKeys.map(async (key:string) => {
          switch (key) {
            case "password":
              // Update password
              const [salt, hash] = storePassword(request.body[key]);

              DBcon.query("UPDATE `TL_users` SET `salt_hash`=?, `hash`=? where `user_id`=?", [
                salt,
                hash,
                (request.params.user_id == '~')? request.user.user_id:request.params.user_id
              ], rejectChange);

              break;
            case "username":
              // Check if the username is used
              const username = await query(
                "SELECT `user_id` FROM `TL_users` WHERE `username`=?",
                [ request.body.username ]
              );

              if (username.length > 0 && _.get(username, '[0].user_id', 0) != request.params.user_id) { // Username is taken
                response.status(400);

                response.send(JSON.stringify({
                  status: 400,
                  message: 'Username is taken.',
                }));

                hasFailed = true;
              } else {  // Every things good
                changeUser(key, request, rejectChange);
              }

              break;
            case "apiKey":
              // Do nothing with the api key;
              break;
            default:
              //  Make the change
              changeUser(key, request, rejectChange);
              break;
          }
        }));

        // Done?
        if (!hasFailed) {
          resolve();
        }
      }

      // Run it async for speed
      changeKey();
    });

    // Run the code
    updateUser.then(() => {
      responseDone(response);
    }).catch((message) => {
      response.status(400);
      response.send(JSON.stringify({
        status: 400,
        message: "Could not save the changes." + message
      }));
    });
  }).catch(() => {
    // Something went wrong
    response.status(400);
    response.send(JSON.stringify({
      status: 400,
      message: apiError
    }));
  });
}, handleReject());