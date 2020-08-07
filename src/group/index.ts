import { promisify } from 'util';
import { DBcon } from '..';
import Api from '../scripts/api';
import { mysqlTEXT } from '../scripts/types';
import { handleQuery } from '../scripts/handle';
import { responseDone, responseCreated } from '../scripts/response';

const query = promisify(DBcon.query).bind(DBcon);

export interface TL_groups {
  group_id:  number;
  groupName: string;
}

new Api({
  url: '/group',
  auth: true,
  require: {
    post: [
      {name: 'groupName', check: mysqlTEXT},
    ],
  },
  get: (request, response) => {
    // List all group
    DBcon.query(
      "SELECT * FROM `TL_groups` ORDER BY `groupname`",
      handleQuery(response, (result: Array<TL_groups>) => {
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
            length: rslt.length,
            result: rslt,
          });
        }

        readUser(); // Start the async function
      })
    );
  },
  post: (request, response) => {
    DBcon.query(
      "INSERT INTO `TL_groups` (`groupName`) VALUES (?)",
      [request.body.groupName],
      handleQuery(response, (result) => {
        // Saved to database
        responseCreated(response, {
          group_id: result.insertId
        });
      })
    );
  },
});