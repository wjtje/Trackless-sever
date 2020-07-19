import Api from "../scripts/api";
import { DBcon, server } from "..";
import { handleQuery } from "../scripts/handle";
import { responseDone, responseCreated, responseBadRequest } from "../scripts/response";
import { requiredDataCheck } from "../scripts/dataCheck";
import {  mysqlTEXT } from "../scripts/types";
import { sha512_256 } from "js-sha512";
import * as _ from 'lodash';
import { missingError } from "../scripts/error";
import { checkUsernamePasswd } from "../global/language";

export interface APIKeyNames {
  api_id:     number;
  createDate: string;
  lastUsed:   string;
  deviceName: string;
}

new Api({
  url: '/api',
  auth: true,
  get: (request, response, user) => {
    DBcon.query(
      "SELECT `api_id`, `createDate`, `lastUsed`, `deviceName` FROM `TL_apikeys` WHERE `user_id`=?",
      [user.user_id],
      handleQuery(response, (result: Array<APIKeyNames>) => {
        responseDone(response, {
          result: result
        })
      })
    );
  },
});

server.post('/login', (request, response) => {
  requiredDataCheck(request, response, [
    {name: 'username', check: mysqlTEXT},
    {name: 'password', check: mysqlTEXT},
    {name: 'deviceName', check: mysqlTEXT},
  ]).then(() => {
    // Get the infomation needed from the server
    DBcon.query(
      "SELECT `salt_hash`, `hash`, `user_id` FROM `TL_users` WHERE `username`=?",
      [request.body.username],
      handleQuery(response, (result) => {
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
            handleQuery(response, () => {
              responseCreated(response, {
                bearer: apiKey
              })
            })
          );
        } else {
          responseBadRequest(response, {
            error: {
              message: checkUsernamePasswd
            }
          });
        }
      })
    )
  }).catch(([missing, typeErr]) => {
    // Something is missing report to the user
    missingError(response, missing, typeErr);
  });
});