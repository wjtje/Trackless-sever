import Api from "../scripts/api";
import { string } from "../scripts/types";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseDone } from "../scripts/response";

/**
 * @oas [get] /location
 * description: "Get all the locations from the server."
 */
/**
 * @oas [post] /location
 * description: "Create a new location"
 */
new Api({
  url: '/location',
  auth: true,
  require: {
    post: [
      {name: 'name', check: string},
      {name: 'place', check: string},
      {name: 'id', check: string},
    ],
  },
  get: (request, response) => {
    // Get all the data
    DBcon.query(
      "SELECT * FROM `TL_locations` ORDER BY `place`, `name`",
      handleQuery(response, "Something went wrong", (result) => {
        responseDone(response, {
          result: result
        })
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
      handleQuery(response, 'Could not save your new location.', (result) => {
        // Saved to the database
        responseDone(response, {
          location_id: result.insertId
        });
      })
    );
  }
})