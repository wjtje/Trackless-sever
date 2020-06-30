import {Request, Response} from "express";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseNotFound, responseBadRequest, responseDone } from "../scripts/response";
import Api from "../scripts/api";
import { number } from "../scripts/types";

/**
 * @since 0.2-beta.2
 * @param {Request} request
 * @param {Response} response
 * @param {() => void} then
 */
function checkAccess(request:Request, response:Response, then: () => void) {
  if (number(request.params.access_id)) {
    // Access is a number
    DBcon.query(
      "SELECT `access_id` FROM `TL_access` WHERE `access_id`=?",
      [request.params.access_id],
      handleQuery(response, (result) => {
        if (result.length === 0) {
          // Access is not found
          responseNotFound(response);
        } else {
          // Access is found move on
          then();
        }
      })
    );
  } else {
    responseBadRequest(response, {
      error: {
        message: 'Access_id needs to be a number.'
      }
    });
  }
}

new Api({
  url: '/access/:access_id',
  auth: true,
  delete: (request, response) => {
    checkAccess(request, response, () => {
      // Remove the access
      DBcon.query(
        "DELETE FROM `TL_access` WHERE `access_id`=?",
        [request.params.access_id],
        handleQuery(response, () => {
          responseDone(response);
        })
      )
    });
  },
});