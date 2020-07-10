import Api from "../scripts/api";
import { number, string } from "../scripts/types";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseDone, responseBadRequest } from "../scripts/response";
import { locationIdNotValid } from "../global/language";

new Api({
  url: '/work',
  auth: true,
  require: {
    post: [
      {name: 'location_id', check: number},
      {name: 'time', check: number},
      {name: 'date', check: (testValue: any) => {
        //TODO: Add moment js
        return /[0-9]{4}-[0-9]{2}-[0-9]{2}/g.test(testValue);
      }},
      {name: 'description', check: string},
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
