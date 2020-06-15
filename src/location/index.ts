import { newApi, handleReject } from "../api";
import { DBcon } from "..";
import { handleQuery, responseDone } from "../scripts";

// Get all locations
newApi("get", "/location", [
  {name: "bearer", type: "string"}
], (_request, response) => {
  // Get all the data
  DBcon.query(
    "SELECT * FROM `TL_locations`",
    handleQuery(response, "Something went wrong", (result) => {
      responseDone(response, {
        result: result
      })
    })
  )
}, handleReject());

// Add a new location to the system
newApi("post", "/location", [
  {name: "bearer", type: "string"},
  {name: "name", type: "string"},
  {name: "place", type: "string"},
  {name: "id", type: "string"},
], (request, response) => {
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
}, handleReject());