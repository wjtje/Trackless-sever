// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { sqlError } from '../scripts';
import { apiLogin } from '../api/lib';

// Import other modules
import * as _ from 'lodash';

server.get('/api', (req, res) => {
  if (
    _.has(req.body, "apiKey")
  ) {
    apiLogin(req.body.apiKey).then((result) => {
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

    }).catch((reason) => {
      // Couldn't login
      res.send({
        status: 400,
        message: reason
      });

      res.status(400);
    });
  }
});