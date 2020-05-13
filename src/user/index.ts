// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { missingError, passwordNotSafeError } from '../language';
import { generateString, sqlError, missingErrorFun, loginFault, apiCheck } from '../scripts';
import { apiLogin } from '../api/lib';

// Import other modules
import * as _ from 'lodash';
import { sha512_256 } from 'js-sha512';

// List all users
server.get('/user', (req, res) => {
  apiCheck(req, res, () => {
    // Get all the users
    DBcon.query(
      "SELECT `user_id`, `firstname`, `lastname`, `username`, `group_id`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`group_id`)",
      (error, result) => {
        if (error) {
          sqlError(res, error, `Couldn't select all the users.`);
        } else {
          // Done
          res.send(JSON.stringify({
            status: 200,
            message: 'done',
            result: result
          }));

          res.status(200);
        }
      }
    );
  });
});

// Create a new user
server.post('/user', (req, res) => {
  // Check if all the requested data is here
  if (
    // Check if it exsist
    _.has(req.body, 'firstname') &&
    _.has(req.body, "lastname") &&
    _.has(req.body, "username") &&
    _.has(req.body, "password") &&
    _.has(req.body, "apiKey") &&
    _.has(req.body, "group_id") &&

    // Check if it is not empty
    _.get(req.body, "firstname") != '' &&
    _.get(req.body, "lastname") != '' &&
    _.get(req.body, "username") != '' &&
    _.get(req.body, "group_id") != ''
  ) {
    // Check for strong password
    if (_.get(req.body, "password") == '') {
      res.send(JSON.stringify({
        status: 400,
        message: passwordNotSafeError
      }));
      res.status(400);
    }

    // Try logging in
    apiLogin(req.body.apiKey).then(() => {
      // Check if username is available
      DBcon.query(
        "SELECT `username` FROM `TL_users` WHERE `username`=?",
        [
          req.body.username
        ],
        (error, result) => {

          if (error) {  // SQL error
            sqlError(res, error, `Something went wrong while checking the user name = '${req.body.username}'`);
          } else if (result.length > 0) { // Username is taken
            res.send(JSON.stringify({
              status: 400,
              message: 'Username is taken.',
            }));
    
            res.status(400);
          } else {  // Every things good
            // Create a new user
            // Generate salt
            const salt = generateString(32);  // Safety

            // Commit to the database
            DBcon.query(
              "INSERT INTO `TL_users` ( `firstname`, `lastname`, `username`, `group_id`, `salt_hash`, `hash` ) VALUES ( ?, ?, ?, ?, ?, ?)",
              [
                req.body.firstname,
                req.body.lastname,
                req.body.username,
                Number(req.body.group_id),
                salt,
                sha512_256(req.body.password + salt)
              ],
              (error, result) => {
                // Check if it has been saved
                if (error) {
                  sqlError(res, error, `Couldn't save the user into the database. Please try again later`);
                } else {

                  // User has been created
                  // Get the user_id
                  DBcon.query(
                    "SELECT `user_id` FROM `TL_users` ORDER BY `user_id` DESC LIMIT 1",
                    (error, result) => {
                      if (error) {  // Sql error
                        sqlError(res, error, `Couldn't find the user_id for the newly created user.`);
                      } else { // found the user id

                        // Done
                        res.send(JSON.stringify({
                          status: 200,
                          message: 'done',
                          user_id: result[0].user_id
                        }));

                        res.status(200);

                      }
                    }
                  );

                }
              }
            );

          }
        }
      );
    }).catch(loginFault(res));
  } else { missingErrorFun(res) }
});
