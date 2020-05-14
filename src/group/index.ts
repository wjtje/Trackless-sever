// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { apiCheck, handleQuery, responseDone, reqDataCheck } from '../scripts';

// Import other modules
import * as _ from 'lodash';

// List all the groups
server.get('/group', (req, res) => {
  apiCheck(req, res, () => {
    // List all group
    DBcon.query(
      "SELECT * FROM `TL_groups`",
      handleQuery(res, `Could not list all the groups.`, (result) => {
        responseDone(res, {
          result: result
        })
      })
    );
  });
});

// Create a new group
server.post('/group', (req, res) => {
  reqDataCheck(req, res, [
    "name",
  ], () => {
    apiCheck(req, res, () => {
      DBcon.query(
        "INSERT INTO `TL_groups` (`groupName`) VALUES (?)",
        [req.body.name],
        handleQuery(res, 'Could not save your new group', (result) => {
          // Saved to database
          responseDone(res, {
            group_id: result.insertId
          });
        })
      );
    });
  });
});
