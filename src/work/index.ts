import { newApi, handleReject } from "../api";
import { responseDone, handleQuery } from "../scripts";
import { DBcon } from "..";

// Add work
newApi('post', '/work', [
  {name: "bearer", type: "string"},
  {name: "location_id", type: "number"},
  {name: "time", type: "number"},
  {name: "date", type: "date"},
  {name: "description", type: "string"},
], (request, response, user) => {
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
    handleQuery(response, "Something went wrong", (result) => {
      // Response with the new id
      responseDone(response, {
        work_id: result.insertId
      })
    })
  )
}, handleReject());