// Import the server and db con from index
import { DBcon } from '../index';

// Import string and scripts we need
import { handleQuery, responseDone } from '../scripts';
import { newApi, handleReject } from '../api';

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
newApi("get", "/api", [
  {name: "apiKey", type: "string"}
], (_request, response, userInfo) => {
  DBcon.query(
    "SELECT `api_id`, `createDate`, `lastUsed`, `deviceName` FROM `TL_apikeys` WHERE `user_id`=?",
    [userInfo.user_id],
    handleQuery(response, `Something went wrong`, (result: Array<APIKeyNames>) => {
      responseDone(response, {
        result: result
      })
    })
  );
}, handleReject());

// Create a apiKey
newApi("post", "/api", [
  {name: "username", type: "string"},
  {name: "password", type: "string"},
  {name: "deviceName", type: "string"},
], (request, response) => {
  // Get the infomation needed from the server
  DBcon.query(
    "SELECT `salt_hash`, `hash`, `user_id` FROM `TL_users` WHERE `username`=?",
    [request.body.username],
    handleQuery(response, `Could not contact the server. Please try again later.`, (result) => {
      // Check the password
      if (sha512_256(request.body.password + _.get(result, '[0].salt_hash', '')) === _.get(result, '[0].hash', '')) {
        const apiKey:string = sha512_256(Date.now().toString()); // Generated using time
        const user_id:number = result[0].user_id;

        // Send it to the database
        DBcon.query(
          "INSERT INTO `TL_apikeys` ( `apiKey`, `deviceName`, `user_id` ) VALUES (?,?,?)",
          [
            sha512_256(apiKey),
            request.body.deviceName,
            user_id
          ],
          handleQuery(response, 'Something went wrong. Please try again later.', () => {
            responseDone(response, {
              apiKey: apiKey
            })
          })
        );
      } else {
        response.send(JSON.stringify({
          status: 403,
          message: `Please check your username or password.`
        }));

        response.status(403);
      }
    })
  )
}, handleReject())