// Import the server and db con from index
import { DBcon } from '../index';

// Import string and scripts we need
import { handleQuery, responseDone } from '../scripts';
import { newApi, handleReject } from '../api';

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
newApi("get", '/group', [
  {name: "bearer", type: "string"}
], (_request, response) => {
  // List all group
  DBcon.query(
    "SELECT * FROM `TL_groups` ORDER BY `groupname`",
    handleQuery(response, `Could not list all the groups.`, (result: Array<TL_groups>) => {
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

        responseDone(response, {
          result: rslt
        })
      }

      readUser(); // Start the async function
    })
  );
}, handleReject());

// Create a new group
newApi("post", '/group', [
  {name: "bearer", type: "string"},
  {name: "groupName", type: "string"}
], (request, response) => {
  DBcon.query(
    "INSERT INTO `TL_groups` (`groupName`) VALUES (?)",
    [request.body.groupName],
    handleQuery(response, 'Could not save your new group', (result) => {
      // Saved to database
      responseDone(response, {
        group_id: result.insertId
      });
    })
  );
}, handleReject());
