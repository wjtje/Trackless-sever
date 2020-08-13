import express from 'express';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';
import requireHandler from '../../scripts/RequestHandler/requireHandler';
import { mysqlTEXT } from '../../scripts/types';
import { DBcon } from '../..';
import { handleQuery } from '../../scripts/handle';
import { sha512_256 } from 'js-sha512';
import _ from 'lodash';
import ServerError from '../../scripts/RequestHandler/serverErrorInterface';

const router = express.Router();

router.post(
  '/',
  requireHandler([
    {name: 'username', check: mysqlTEXT},
    {name: 'password', check: mysqlTEXT},
    {name: 'deviceName', check: mysqlTEXT},
  ]),
  (request, response, next) => {
    // Get the hash, salt and user_id from the server
    DBcon.query(
      "SELECT `salt_hash`, `hash`, `user_id` FROM `TL_users` WHERE `username`=?",
      [request.body.username],
      handleQuery(next, (result) => {
        // Check the password
        if (sha512_256(request.body.password + _.get(result, '[0].salt_hash', '')) === _.get(result, '[0].hash', '')) {
          // Password correct
          // Create an apiKey using time
          const apiKey:string = sha512_256(Date.now().toString());

          // Save it to the database
          DBcon.query(
            "INSERT INTO `TL_apikeys` (`apiKey`, `deviceName`, `user_id`) VALUES (?,?,?)",
            [
              sha512_256(apiKey),
              request.body.deviceName,
              result[0].user_id
            ],
            handleQuery(next, () => {
              response.status(200).json({
                bearer: apiKey
              });
            })
          )
        } else {
          // Password incorrect
          const error: ServerError = new Error("Incorrect username or password");
          error.code = 'trackless.login.badLogin';
          error.status = 400;
          next(error);
        }
      })
    )
  }
);

router.use(unusedRequestTypes());

export default router;