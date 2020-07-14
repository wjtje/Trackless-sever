import Api from "../scripts/api";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseDone } from "../scripts/response";
import _ = require("lodash");
import moment = require("moment");

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
          location_id: _.get(result, '[0].location_id', 0)
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
    // Get most used location_id from the server (limit 2)
    DBcon.query(
      "SELECT `location_id`, COUNT(`location_id`) as `occurrence` FROM `TL_work` WHERE `user_id` = ? AND `date` >= ? AND `date` <= ? GROUP BY `location_id` ORDER BY `occurrence` DESC LIMIT 2",
      [
        userInfo.user_id,
        moment().subtract(7, 'days').format("YYYY-MM-DD"),  // Last week
        moment().format("YYYY-MM-DD"),                      // Now
      ],
      handleQuery(response, (result) => {
        responseDone(response, {
          location_id: [
            _.get(result, '[0].location_id', 0),
            _.get(result, '[1].location_id', 0),
          ]
        })
      })
    );
  }
})