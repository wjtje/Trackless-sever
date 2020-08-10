import Api from "../../scripts/api";
import { mysqlINT, mysqlDATE, mysqlTEXT } from "../../scripts/types";
import { DBcon } from "../..";
import { handleQuery } from "../../scripts/handle";
import { responseDone, responseBadRequest } from "../../scripts/response";
import { locationIdNotValid } from "../../global/language";

new Api({
  url: '/work',
  auth: true,
  require: {
    post: [
      {name: 'location_id', check: mysqlINT},
      {name: 'time', check: mysqlINT},
      {name: 'date', check: mysqlDATE},
      {name: 'description', check: mysqlTEXT},
    ]
  },
  post: (request, response, user) => {
    // Check if the location_id is valid
    DBcon.query(
      "SELECT `location_id` FROM `TL_locations` WHERE `location_id`=?",
      [request.body.location_id],
      handleQuery(response, (result) => {
        if (result.length === 0) {
          responseBadRequest(response, {
            error: {
              message: locationIdNotValid
            }
          })
        } else {
          // Location_id is valid 
          // Push the new work to the server
          DBcon.query(
            "INSERT INTO `TL_work` (`user_id`, `location_id`, `time`, `date`, `description`) VALUES (?,?,?,?,?)",
            [
              user.user_id,
              request.body.location_id,
              request.body.time,
              request.body.date,
              request.body.description,
            ],
            handleQuery(response, (result) => {
              // Response with the new id
              responseDone(response, {
                work_id: result.insertId
              })
            })
          );
        }
      })
    )
  },
});
