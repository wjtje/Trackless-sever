// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { missingError, passwordNotSafeError } from '../language';
import { generateString, sqlError, missingErrorFun, loginFault, apiCheck, handleQuery } from '../scripts';
import { apiLogin } from '../api/lib';

// Import other modules
import * as _ from 'lodash';
import { sha512_256 } from 'js-sha512';

// List all the groups
server.get('/group', (req, res) => {
  apiCheck(req, res, () => {
    // List all group
    DBcon.query(
      "SELECT * FROM `TL_groups`",
      handleQuery(res, `Could not list all the groups.`, (result) => {
        // Done
        res.send(JSON.stringify({
          status: 200,
          message: 'done',
          result: result
        }));

        res.status(200);
      })
    );
  });
});
