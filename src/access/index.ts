import { newApi, handleReject } from "../api";
import { DBcon } from "..";
import { handleQuery, responseDone } from "../scripts";
const util = require('util');
const query = util.promisify(DBcon.query).bind(DBcon);

// Interfaces
export interface TL_groups {
  group_id:  number;
  groupName: string;
}

newApi("get", "/access", [
  {name: "apiKey", type: "string"}
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
}, handleReject())