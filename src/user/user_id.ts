// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { apiCheck, handleQuery, responseDone, arrayContainOnly } from '../scripts';

// Import other modules
import * as _ from 'lodash';
import { apiError } from '../language';
import { rejects } from 'assert';

// Get a user
server.get('/user/:user_id', (req, res) => {
  apiCheck(req, res, () => {
    // Get all the infomation from the database
    DBcon.query(
      "SELECT `user_id`, `firstname`, `lastname`, `username`, `group_id`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`group_id`) WHERE `user_id`=?",
      [req.params.user_id],
      handleQuery(res, `Couldn't find the user '${req.params.user_id}'`, (result) => {
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
      const updateUser = new Promise((resolve, reject) => {
        let hasFailed = false;

        objectKeys.forEach(async (key) => {
          if (key == "password") {
            // Update password
          } else if (key != "apiKey") {
            // Update it
            DBcon.query("UPDATE `TL_users` SET `" + key + "`=? WHERE `user_id`=?", [
              req.body[key],
              Number(req.params.user_id)
            ], (error) => {
              if (error) {
                // Could not save it
                hasFailed = true;
                reject();
              }
            });
          }
        });

        if (!hasFailed) {
          resolve();
        }
      });

      // Run the code
      updateUser.then(() => {
        responseDone(res);
      }).catch(() => {
        res.send(JSON.stringify({
          status: 400,
          message: "Could not save the changes."
        }));

        res.status(400);
      });
    }).catch(() => {
      res.send(JSON.stringify({
        status: 400,
        message: apiError
      }));

      res.status(400);
    });
  });
});