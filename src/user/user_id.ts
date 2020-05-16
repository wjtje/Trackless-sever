// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { apiCheck, handleQuery, responseDone, arrayContainOnly, storePassword } from '../scripts';

// Import other modules
import * as _ from 'lodash';
import { apiError } from '../language';
const util = require('util');
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
server.get('/user/:user_id', (req, res) => {
  apiCheck(req, res, () => {
    // Get all the infomation from the database
    DBcon.query(
      "SELECT `user_id`, `firstname`, `lastname`, `username`, `group_id`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`group_id`) WHERE `user_id`=?",
      [req.params.user_id],
      handleQuery(res, `Couldn't find the user '${req.params.user_id}'`, (result: Array<TL_user>) => {
        // Send the data to the user
        responseDone(res, {
          result: result
        })
      })
    );
  });
});

// Delete a user from the system
server.delete('/user/:user_id', (req, res) => {
  apiCheck(req, res, () => {
    // Send the command to the database
    DBcon.query(
      "DELETE FROM `TL_users` WHERE `user_id`=?",
      [Number(req.params.user_id)],
      handleQuery(res, `Couldn't delete the user '${req.params.user_id}'`, () => {
        // Delete all apikeys
        DBcon.query(
          "DELETE FROM `TL_apikeys` WHERE `user_id`=?",
          [req.params.user_id]
        );

        // Done
        responseDone(res);
      })
    );
  });
});

// Update a users info
server.patch('/user/:user_id', (req, res) => {
  apiCheck(req, res, () => {
    // Check if there are no bad values
    let objectKeys = Object.keys(req.body);
    const searchArray = [
      "firstname",
      "lastname",
      "username",
      "group_id",
      "password",

      "apiKey", // Needed
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
            Number(req.params.user_id)
          ], rejectChange);
        }

        // Change each key
        async function changeKey() {
          await Promise.all(objectKeys.map(async (key:string) => {
            switch (key) {
              case "password":
                // Update password
                const [salt, hash] = storePassword(req.body[key]);

                await query(
                  "UPDATE `TL_users` SET `salt_hash`=?, `hash`=? where `user_id`=?",
                  [
                    salt,
                    hash,
                    Number(req.params.user_id)
                  ],
                  rejectChange
                );

                break;
              case "group_id":
                // List the group
                const group = await query(
                  "SELECT `groupname` FROM `TL_groups` WHERE `group_id`=?",
                  [
                    Number(req.body[key])
                  ]
                );

                // Does the group exsist?
                if (group[0] == undefined) {
                  hasFailed = true;
                  reject(' (ERR GROUP_ID)');
                } else {
                  // Make the change
                  DBcon.query("UPDATE `TL_users` SET `" + key + "`=? WHERE `user_id`=?", [
                    Number(req.body[key]),
                    Number(req.params.user_id)
                  ], rejectChange);
                }

                break;
              case "apiKey":
                // Do nothing with the api key;
                break;
              default:
                //  Make the change
                changeUser(key, req, rejectChange);
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
        responseDone(res);
      }).catch((message) => {
        res.send(JSON.stringify({
          status: 400,
          message: "Could not save the changes." + message
        }));

        res.status(400);
      });
    }).catch(() => {
      // Something went wrong
      res.send(JSON.stringify({
        status: 400,
        message: apiError
      }));

      res.status(400);
    });
  });
});
