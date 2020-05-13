// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { missingError } from '../language';
import { sqlError, apiCheck } from '../scripts';
import { apiLogin } from '../api/lib';

// Import other modules
import * as _ from 'lodash';
import { sha512_256 } from 'js-sha512';

// List all apiKey device names
server.get('/api', (req, res) => {
  apiCheck(req, res, (result) => {
    // Get all the users api keys
    DBcon.query(
      "SELECT `api_id`, `createDate`, `lastUsed`, `deviceName` FROM `TL_apikeys` WHERE `user_id`=?",
      [result.user_id],
      (error, result) => {
        if (error) {
          // IDK there is an error
          sqlError(res, error, 'Something went wrong.');
        } else {

          // Send the data to the user
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

// Create a apiKey
server.post('/api', (req, res) => {
  // Check if there is a username an a password
  if (
    _.has(req.body, "username") &&
    _.has(req.body, "password") &&
    _.has(req.body, "deviceName")
  ) {
    // Check the password
    DBcon.query(
      "SELECT `salt_hash`, `hash`, `user_id` FROM `TL_users` WHERE `username`=?",
      [req.body.username],
      (error, result) => {
        if (error) {
          // Something went wrong
          sqlError(res, error, `Please check your username and password.`);
        } else {

          // Check if the password is correct
          if (sha512_256(req.body.password + result[0].salt_hash) === result[0].hash) {
            const apiKey:string = sha512_256(Date.now().toString()); // Generated using time
            const user_id:number = result[0].user_id;

            // Send it to the database
            DBcon.query(
              "INSERT INTO `TL_apikeys` ( `apiKey`, `deviceName`, `user_id` ) VALUES (?,?,?)",
              [
                sha512_256(apiKey),
                req.body.deviceName,
                user_id
              ],
              (error, result) => {
                if (error) {
                  // Something went wrong
                  sqlError(res, error, `Something went wrong. Please try again later.`);
                } else {

                  // Send the api key
                  res.send({
                    status: 200,
                    message: 'done',
                    apiKey: apiKey
                  });

                  res.status(200);

                }
              }
            );

          } else {
            // Password not correct
            res.send(JSON.stringify({
              status: 403,
              message: 'Please check your username and password.'
            }));
            res.status(403);
          }

        }
      }
    );
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