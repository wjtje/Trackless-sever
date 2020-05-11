// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { missingError, passwordNotSafeError, sqlError } from '../language';
import { generateString } from '../scripts';

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
          // Report to the user
          res.send(JSON.stringify({
            status: 500,
            message: sqlError,
            sqlError: error,
          }));
  
          res.status(500);
  
          console.log(error);
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
                // Report to the user
                res.send(JSON.stringify({
                  status: 500,
                  message: sqlError,
                  sqlError: error,
                }));

                res.status(500);

                console.log(error);
              } else {
                // Done
                res.send(JSON.stringify({
                  status: 200,
                  message: 'done',
                }));

                res.status(200);
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