import * as util from 'util';
import { DBcon } from '..';
import Api from '../scripts/api';
import { responseDone, responseBadRequest, responseCreated } from '../scripts/response';
import { handleQuery } from '../scripts/handle';
import { number, string } from '../scripts/types';

const query = util.promisify(DBcon.query).bind(DBcon);

export interface TL_groups {
  group_id:  number;
  groupName: string;
}

new Api({
  url: '/access',
  auth: true,
  require: {
    post: [
      {name: 'group_id', check: number},
      {name: 'method', check: string},
      {name: 'url', check: string},
    ]
  },
  get: (request, response) => {
    DBcon.query(
      "SELECT * FROM `TL_groups`",
      handleQuery(response, (result: Array<TL_groups>) => {
        let rslt = [];
  
        async function readAccess() {
          await Promise.all(result.map(async (group: TL_groups) => {
            // Connect to the database
            const access = await query("SELECT `access_id`, `method`, `url` FROM `TL_access` WHERE `group_id`=?", [group.group_id]);
  
            // Append to list
            rslt.push({
              group_id: group.group_id,
              groupName: group.groupName,
              access: access
            })
          }));
  
          responseDone(response, {
            length: rslt.length,
            result: rslt
          });
        }
  
        readAccess(); // Start the async function
      })
    )
  },
  post: (request, response) => {
    // Checks if the group exsist
    DBcon.query(
      "SELECT `group_id` FROM `TL_groups` WHERE `group_id`=?",
      [request.body.group_id],
      handleQuery(response, (result) => {
        if (result.length === 0) {
          responseBadRequest(response, {
            error: {
              message: 'The group is not found.'
            }
          })
        } else if (!["get","post","delete","patch"].includes(request.body.method)) {
          responseBadRequest(response, {
            error: {
              message: 'The method is not allowed.'
            }
          });
        } else {
          DBcon.query(
            "INSERT INTO `TL_access` (`group_id`, `method`, `url`) VALUES (?,?,?)",
            [
              request.body.group_id,
              request.body.method,
              request.body.url
            ],
            handleQuery(response, (result) => {
              responseCreated(response, {
                access_id: result.insertId
              });
            })
          )
        }
      })
    )
  }
});

new Api({
  url: '/access/~',
  auth: true,
  get: (request, response, user) => {
    DBcon.query(
      "SELECT `method`, `url` FROM `TL_access` WHERE `group_id`=?",
      [user.group_id],
      handleQuery(response, (result) => {
        responseDone(response, {
          length: result.length,
          result: result
        });
      })
    );
  }
});