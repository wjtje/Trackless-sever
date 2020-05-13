// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { passwordNotSafeError } from '../language';
import { generateString, missingErrorFun, loginFault, apiCheck, handleQuery, responseDone } from '../scripts';
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
      handleQuery(res, 'Couldn\'t select all the users.', (result) => {
        responseDone(res, {
          result: result
        })
      })
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
        handleQuery(res, `Something went wrong while checking the user name = '${req.body.username}'`, (result) => {
          if (result.length > 0) { // Username is taken
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
              handleQuery(res, 'Couldn\'t save the user into the database. Please try again later', () => {
                // User has been created
                // Get the user_id
                DBcon.query(
                  "SELECT `user_id` FROM `TL_users` ORDER BY `user_id` DESC LIMIT 1",
                  handleQuery(res, `Couldn't find the user_id for the newly created user.`, (result) => {
                    responseDone(res, {
                      user_id: result[0].user_id
                    })
                  })
                );
              })
            );
          }
        })
      );
    }).catch(loginFault(res));
  } else { missingErrorFun(res) }
});
