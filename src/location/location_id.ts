import Api from "../scripts/api";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseDone, responseBadRequest, responseNotFound } from "../scripts/response";
import { arrayContainOnly } from "../scripts/dataCheck";
import { Request, Response } from 'express';
import { number } from "../scripts/types";
import { itemPatch } from "../scripts/patch";

/**
 * @since 0.2-beta.2
 * @param {Request} request
 * @param {Response} response
 * @param {() => void} then
 */
function checkLocation(request:Request, response:Response, then: () => void) {
  if (number(request.params.location_id)) {
    then()
  } else {
    responseBadRequest(response, {
      error: {
        message: 'Your location_id is not correct'
      }
    });
  }
}

new Api({
  url: '/location/:location_id',
  auth: true,
  get: (request, response) => {
    checkLocation(request, response, () => {
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
    checkLocation(request, response, () => {
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
    checkLocation(request, response, () => {
      itemPatch(request, response, [
        "name",
        "place",
        "id",
      ], (key, request, rejectChange) => {
        // Update the key
        DBcon.query(
          "UPDATE `TL_locations` SET `" + key + "`=? WHERE `location_id`=?",
          [request.body[key], request.params.location_id]
        )
      });
    });
  }
})