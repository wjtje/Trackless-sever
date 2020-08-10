import Api from "../../scripts/api";
import { DBcon } from "../..";
import { handleQuery } from "../../scripts/handle";
import { responseDone } from "../../scripts/response";
import { get as _get, result } from "lodash";
import moment from "moment";
import { promisify } from 'util';

const query = promisify(DBcon.query).bind(DBcon);

// Get last used location for that user
new Api({
  url: '/location/user/:user_id/last',
  auth: true,
  get: (request, response, userInfo) => {
    // Get last location_id from the server
    DBcon.query(
      "SELECT `location_id` FROM `TL_work` WHERE `user_id`=? ORDER BY `work_id` DESC LIMIT 1",
      [userInfo.user_id],
      handleQuery(response, (result) => {
        responseDone(response, {
          location_id: _get(result, '[0].location_id', 0)
        })
      })
    )
  }
});

// Get most used locations from that user in the last week
new Api({
  url: '/location/user/:user_id/most',
  auth: true,
  get: (request, response, userInfo) => {
    // Get two random locations
    DBcon.query(
      "SELECT r1.location_id, r1.name, r1.place, r1.id FROM `TL_locations` AS r1 JOIN (SELECT CEIL(RAND() * (SELECT MAX(location_id) FROM `TL_locations`)) AS location_id) AS r2 WHERE r1.location_id >= r2.location_id ORDER BY r1.location_id ASC LIMIT 2",
      handleQuery(response, (randomLocations) => {
        // Get most used location_id from the server (limit 2)
        DBcon.query(
          "SELECT `location_id`, `name`, `place`, `id`, COUNT(`location_id`) as `occurrence` FROM `TL_work` INNER JOIN `TL_locations` USING (`location_id`) WHERE `user_id` = ? AND `date` >= ? AND `date` <= ? GROUP BY `location_id` ORDER BY `occurrence` DESC LIMIT 2",
          [
            userInfo.user_id,
            moment().subtract(7, 'days').format("YYYY-MM-DD"),  // Last week
            moment().format("YYYY-MM-DD"),                      // Now
          ],
          handleQuery(response, (result) => {
            responseDone(response, {
              location_id: [
                _get(result, '[0]', {
                  ...randomLocations[0],
                  occurrence: 0,
                }),
                _get(result, '[1]', {
                  ...randomLocations[1],
                  occurrence: 0,
                }),
              ]
            })
          })
        )
      })
    )
  }
})