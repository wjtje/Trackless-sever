import { promisify } from 'util';
import { DBcon } from '../../';
import Api from '../../scripts/api';
import { responseDone, responseBadRequest, responseCreated } from '../../scripts/response';
import { handleQuery } from '../../scripts/handle';
import { mysqlINT, mysqlTEXT } from '../../scripts/types';
import { groupNotFound, methodNotAllowd } from '../../global/language';

const query = promisify(DBcon.query).bind(DBcon);

export interface TL_groups {
  group_id:  number;
  groupName: string;
}

new Api({
  url: '/access',
  auth: true,
  require: {
    post: [
      {name: 'group_id', check: mysqlINT},
      {name: 'method', check: mysqlTEXT},
      {name: 'url', check: mysqlTEXT},
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
              message: groupNotFound
            }
          })
        } else if (!["get","post","delete","patch"].includes(request.body.method)) {
          responseBadRequest(response, {
            error: {
              message: methodNotAllowd
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