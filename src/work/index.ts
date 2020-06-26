import Api from "../scripts/api";
import { number, string } from "../scripts/types";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseDone } from "../scripts/response";

new Api({
  url: '/work',
  auth: true,
  require: {
    post: [
      {name: 'location_id', check: number},
      {name: 'time', check: number},
      {name: 'date', check: (testValue: any) => {
        return /[0-9]{4}-[0-9]{2}-[0-9]{2}/g.test(testValue);
      }},
      {name: 'description', check: string},
    ]
  },
  post: (request, response, user) => {
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
    );
  },
});
