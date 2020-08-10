import Api from "../../scripts/api";
import { mysqlTEXT } from "../../scripts/types";
import { DBcon } from "../../";
import { handleQuery } from "../../scripts/handle";
import { responseDone, responseCreated } from "../../scripts/response";

new Api({
  url: '/location',
  auth: true,
  require: {
    post: [
      {name: 'name', check: mysqlTEXT},
      {name: 'place', check: mysqlTEXT},
      {name: 'id', check: mysqlTEXT},
    ],
  },
  get: (request, response) => {
    // Get all the data
    DBcon.query(
      "SELECT * FROM `TL_locations` ORDER BY `place`, `name`",
      handleQuery(response, (result) => {
        responseDone(response, {
          length: result.length,
          result: result
        });
      })
    )
  },
  post: (request, response) => {
    // Push it to the server
    DBcon.query(
      "INSERT INTO `TL_locations` (`name`, `place`, `id`) VALUES (?, ?, ?)",
      [
        request.body.name,
        request.body.place,
        request.body.id,
      ],
      handleQuery(response, (result) => {
        // Saved to the database
        responseCreated(response, {
          location_id: result.insertId
        });
      })
    );
  }
})