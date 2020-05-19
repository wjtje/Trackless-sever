// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { apiCheck, handleQuery, responseDone, reqDataCheck } from '../scripts';

// Import other modules
import * as _ from 'lodash';
import { sha512_256 } from 'js-sha512';

// Interfaces
export interface APIKeyNames {
  api_id:     number;
  createDate: string;
  lastUsed:   string;
  deviceName: string;
}

// List all apiKey device names
server.get('/api', (req, res) => {
  apiCheck(req, res, (result) => {
    // Get all the users api keys
    DBcon.query(
      "SELECT `api_id`, `createDate`, `lastUsed`, `deviceName` FROM `TL_apikeys` WHERE `user_id`=?",
      [result.user_id],
      handleQuery(res, 'Something went wrong.', (result: Array<APIKeyNames>) => {
        responseDone(res, {
          result: result
        });
      })
    );
  });
});

// Create a apiKey
server.post('/api', (req, res) => {
  reqDataCheck(req, res, [
    {name: "username", type: "string"},
    {name: "password", type: "string"},
    {name: "deviceName", type: "string"},
  ], () => {
    // Check the password
    DBcon.query(
      "SELECT `salt_hash`, `hash`, `user_id` FROM `TL_users` WHERE `username`=?",
      [req.body.username],
      handleQuery(res, 'The is an error while contacting the server.', (result) => {
        // Check if the password is correct
        if (sha512_256(req.body.password + _.get(result, '[0].salt_hash', '')) === _.get(result, '[0].hash', '')) {
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
            handleQuery(res, 'Something went wrong. Please try again later.', () => {
              responseDone(res, {
                apiKey: apiKey
              })
            })
          );
        } else {
          // Password not correct
          res.send(JSON.stringify({
            status: 403,
            message: 'Please check your username and password.'
          }));
          res.status(403);
        }
      })
    );
  })
});