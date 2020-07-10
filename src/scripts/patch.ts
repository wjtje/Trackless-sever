import { arrayContainOnly } from "./dataCheck";
import { DBcon } from "..";
import { responseDone, responseBadRequest } from "./response";
import { Request, Response } from "express";

/**
 * A function for a patch request
 * 
 * @since 0.2-beta.2
 * @param {Request} request
 * @param {Response} response
 * @param {Array<string>} editArray An array with the key that can be changed
 * @param {(key: string, request: Request, rejectChange: (error: any) => void) => void} changeKey A function that will run when the key needs to be change
 * @example
 *  itemPatch(request, response, [
 *    "name",
 *    "place",
 *    "id",
 *  ], (key, request, rejectChange) => {
 *    // Update the key
 *    DBcon.query(
 *      "UPDATE `TL_locations` SET `" + key + "`=? WHERE `location_id`=?",
 *      [request.body[key], request.params.location_id]
 *    )
 *  });
 */
export function itemPatch(request: Request, response: Response, editArray: Array<string>, changeKey: (key: string, resolve: (value?:any) => void, reject: (value?:any) => void) => void) {
  let objectKeys = Object.keys(request.body);

  // Make sure the objects keys does not contain anything wrong
  arrayContainOnly(objectKeys, editArray).then(() => {
    // Start a transaction
    DBcon.query("START TRANSACTION");

    // Run change function in a promise
    Promise.all(objectKeys.map((key: string) => {
      return new Promise((resolve, reject) => {
        changeKey(key, resolve, reject);
      });
    })).then(() => {
      // Done
      DBcon.query("COMMIT");

      responseDone(response);
    }).catch((error) => {
      // Something went wrong
      DBcon.query("ROLLBACK");

      responseBadRequest(response, {
        error: {
          message: (typeof error === 'object')? error.code : error
        }
      });
    })
  }).catch(() => {
    responseBadRequest(response, {
      error: {
        message: 'Your requestBody contains something wrong.'
      }
    });
  });
}

/**
 * New function for handling a request
 * 
 * @since 0.3-beta.1
 * @param reject 
 * @param resolve 
 */
export function handlePatchRequest(reject: (value?: any) => void, resolve: (value?: any) => void) {
  return (error) => {
    if (error) {
      reject(error);
    }
    else {
      resolve();
    }
  };
}