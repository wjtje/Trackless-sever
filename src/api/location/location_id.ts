import Api from "../../scripts/api";
import { DBcon } from "../../";
import { handleQuery } from "../../scripts/handle";
import { responseDone, responseNotFound } from "../../scripts/response";
import { itemPatch, handlePatchRequest } from "../../scripts/patch";
import { checkLocationId } from "../../scripts/idCheck";

new Api({
  url: '/location/:location_id',
  auth: true,
  get: (request, response) => {
    checkLocationId(request, response, () => {
      // Get from the database
      DBcon.query("SELECT * FROM `TL_locations` WHERE `location_id`=?", [request.params.location_id], handleQuery(response, (result) => {
        if (result.length === 0) {
          // Not found
          responseNotFound(response);
        } else {
          responseDone(response, {
            length: result.length,
            result: result
          });
        }
      }));
    });
  },
  delete: (request, response) => {
    checkLocationId(request, response, () => {
      // Delete from database
      DBcon.query(
        "DELETE FROM `TL_locations` WHERE `location_id`=?",
        [request.params.location_id],
        handleQuery(response, () => {
          responseDone(response);
        })
      );
    });
  },
  patch: (request, response) => {
    checkLocationId(request, response, () => {
      // Setup the patch function
      itemPatch(request, response, [
        "name",
        "place",
        "id",
      ], (key, resolve, reject) => {
        // Update the key
        DBcon.query(
          "UPDATE `TL_locations` SET `" + key + "`=? WHERE `location_id`=?",
          [request.body[key], request.params.location_id],
          handlePatchRequest(reject, resolve)
        )
      });
    });
  }
})
