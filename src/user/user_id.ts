// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { } from '../language';
import { sqlError } from '../scripts';

// Import other modules
import * as _ from 'lodash';
import { sha512_256 } from 'js-sha512';

// Get a user
server.get('/user/:user_id', (req, res) => {
  // Create the query
  DBcon.query(
    "SELECT `user_id`, `firstname`, `lastname`, `username` FROM `TL_users` WHERE `user_id`=?",
    [req.params.user_id],
    (error, result) => {
      // If something went wrong
      if (error) {
        sqlError(res, error, `Couldn't find the user '${req.params.user_id}'`);
      } else {
        // Send the data to the user
        res.send(JSON.stringify({
          status: 200,
          message: 'done',
          result: result,
        }));

        res.status(200);
      }
    }
  )
});

server.delete('/user/:user_id', (req, res) => {
  // Create the query
  DBcon.query(
    "DELETE FROM `TL_users` WHERE `user_id`=?",
    [Number(req.params.user_id)],
    (error, result) => {
      if (error) {
        // Something went wrong
        sqlError(res, error, `Couldn't delete the user '${req.params.user_id}'`);
      } else {
        // Success
        res.send(JSON.stringify({
          status: 200,
          message: 'done',
        }));

        res.status(200);
      }
    }
  );
});