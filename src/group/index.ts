// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { apiCheck, handleQuery, responseDone, reqDataCheck } from '../scripts';

// Import other modules
import * as _ from 'lodash';
const util = require('util');
const query = util.promisify(DBcon.query).bind(DBcon);

// Interfaces
export interface TL_groups {
  group_id:  number;
  groupName: string;
}


// List all the groups
server.get('/group', (req, res) => {
  apiCheck(req, res, () => {
    // List all group
    DBcon.query(
      "SELECT * FROM `TL_groups`",
      handleQuery(res, `Could not list all the groups.`, (result: Array<TL_groups>) => {
        let rslt = []; // Result

        // Get all users for each group
        async function readUser() {
          await Promise.all(result.map(async (group: {
            group_id: number;
            groupName: string;
          }) => {
            // Connect to the database
            const users = await query("SELECT `user_id`, `firstname`, `lastname`, `username` FROM `TL_users` WHERE `group_id`=?", [group.group_id]);

            // Append to the rslt list
            rslt.push({
              group_id: group.group_id,
              groupName: group.groupName,
              users: users
            });
          }));

          responseDone(res, {
            result: rslt
          })
        }

        readUser(); // Start the async function
      })
    );
  });
});

// Create a new group
server.post('/group', (req, res) => {
  reqDataCheck(req, res, [
    {name: "name", type: "string"}
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
