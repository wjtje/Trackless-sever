// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { missingError, passwordNotSafeError } from '../language';
import { generateString, sqlError } from '../scripts';

// Import other modules
import * as _ from 'lodash';
import { sha512_256 } from 'js-sha512';

server.post('/user/create', (req, res) => {
  // Check if all the requested data is here
  if (
    // Check if it exsist
    _.has(req.body, 'firstname') &&
    _.has(req.body, "lastname") &&
    _.has(req.body, "username") &&
    _.has(req.body, "password") &&

    // Check if it is not empty
    _.get(req.body, "firstname") != '' &&
    _.get(req.body, "lastname") != '' &&
    _.get(req.body, "username") != ''
  ) {
    // Check for strong password
    if (_.get(req.body, "password") == '') {
      res.send(JSON.stringify({
        status: 400,
        message: passwordNotSafeError
      }));
      res.status(400);
    }

    // Check if username is available
    DBcon.query(
      "SELECT `username` FROM `TL_users` WHERE `username`=?",
      [
        req.body.username
      ],
      (error, result) => {
        if (error) {
          sqlError(res, error, `Something went wrong while checking the user name = '${req.body.username}'`);
        } else if (result.length > 0) {
          // Username is taken
          res.send(JSON.stringify({
            status: 400,
            message: 'Username is taken.',
          }));
  
          res.status(400);
        } else {
          // Create a new user
          // Generate salt
          const salt = generateString(32);

          // Execute the query
          DBcon.query(
            "INSERT INTO `TL_users` ( `firstname`, `lastname`, `username`, `salt_hash`, `hash` ) VALUES ( ?, ?, ?, ?, ?)",
            [
              req.body.firstname,
              req.body.lastname,
              req.body.username,
              salt,
              sha512_256(req.body.password + salt)
            ],
            (error, result) => {
              // Check if there is an error
              if (error) {
                sqlError(res, error, `Couldn't save the user into the database. Please try again later`);
              } else {
                // Created that user
                // Get the user_id
                DBcon.query(
                  "SELECT `user_id` FROM `TL_users` ORDER BY `user_id` DESC LIMIT 1",
                  (error, result) => {
                    if (error) {
                      sqlError(res, error, `Couldn't find the user_id for the newly created user.`);
                    } else {
                      // found the user id
                      res.send(JSON.stringify({
                        status: 200,
                        message: 'done',
                        user_id: result[0].user_id
                      }));

                      res.status(200);
                    }
                  }
                )
              }
            }
          );
        }
      }
    )
  } else {
    // Something is missing
    // throw an error
    res.send(JSON.stringify({
      status: 400,
      message: missingError
    }));
    res.status(400);
  }
});