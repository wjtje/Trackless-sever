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
export function itemPatch(request: Request, response: Response, editArray: Array<string>, changeKey: (key: string, request: Request, rejectChange: (error: any) => void) => void) {
  let objectKeys = Object.keys(request.body);

  // Make sure the objects keys does not contain anything wrong
  arrayContainOnly(objectKeys, editArray).then(() => {
    // Run the function async
    const updateUser = new Promise((resolve, reject) => {
      let hasFailed = false;

      // Custom function for rejecting the change
      const rejectChange = (error) => {
        if (error) {
          // Could not save it
          hasFailed = true;
          reject(' (SAVE ERR)');

          // Save the error
          DBcon.query(
            "INSERT INTO `TL_errors` (`sqlError`) VALUES (?)",
            [
              JSON.stringify(error)
            ]
          );
        }
      };

      // Change each key
      // Run it async for more speed
      (async function runAsync() {
        await Promise.all(objectKeys.map(async (key: string) => {
          changeKey(key, request, rejectChange);
        }));

        // Done?
        if (!hasFailed) {
          resolve();
        }
      })();
    });

    // Run the code
    updateUser.then(() => {
      responseDone(response);
    }).catch((message) => {
      responseBadRequest(response, {
        error: {
          message: message
        }
      });
    });
  }).catch(() => {
    responseBadRequest(response, {
      error: {
        message: 'Your requestBody contains something wrong.'
      }
    });
  });
}
