import { newApi, handleReject } from "../api";
import { DBcon } from "..";
import { handleQuery, responseDone, responseError } from "../scripts";
const util = require('util');
const query = util.promisify(DBcon.query).bind(DBcon);

// Interfaces
export interface TL_groups {
  group_id:  number;
  groupName: string;
}

// List all access info
newApi("get", "/access", [
  {name: "bearer", type: "string"}
], (request, response) => {
  DBcon.query(
    "SELECT * FROM `TL_groups`",
    handleQuery(response, `Could not list all the groups.`, (result: Array<TL_groups>) => {
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
          result: rslt
        });
      }

      readAccess(); // Start the async function
    })
  )
}, handleReject());

// List your access
newApi("get", "/access/~", [
  {name: "bearer", type: "string"}
], (request, response, userInfo) => {
  DBcon.query(
    "SELECT `access_id`, `method`, `url` FROM `TL_access` WHERE `group_id`=?",
    [userInfo.group_id],
    handleQuery(response, `Something went wrong`, (result) => {
      responseDone(response, {
        result: result
      });
    })
  );
}, handleReject());

// Give access to a group
newApi("post", "/access", [
  {name: "bearer", type: "string"},
  {name: "group_id", type: "number"},
  {name: "method", type: "string"},
  {name: "url", type: "string"}
], (request, response) => {
  // Check if the group exsist
  DBcon.query(
    "SELECT `group_id` FROM `TL_groups` WHERE `group_id`=?",
    [request.body.group_id],
    handleQuery(response, 'Something went wrong', (result) => {
      if (result.length === 0) {
        responseError(response, 'The group is not found');
      } else if (!["get","post","delete","patch"].includes(request.body.method)) {
        responseError(response, 'The method is not allowed');
      } else {
        DBcon.query(
          "INSERT INTO `TL_access` (`group_id`, `method`, `url`) VALUES (?,?,?)",
          [
            request.body.group_id,
            request.body.method,
            request.body.url
          ],
          handleQuery(response, 'Something went wrong while trying to save your request.', () => {
            responseDone(response);
          })
        )
      }
    })
  )
}, handleReject());