// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { missingError, passwordNotSafeError, sqlError } from '../language';
import { generateString } from '../scripts';

// Import other modules
import * as _ from 'lodash';
import { sha512_256 } from 'js-sha512';

server.get('/user', (req, res) => {
  // Get all the users
  DBcon.query(
    "SELECT `firstname`, `lastname`, `username` FROM `TL_users` WHERE 1",
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
      } else {
        // Done
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