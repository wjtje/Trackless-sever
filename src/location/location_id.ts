import Api from "../scripts/api";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseDone } from "../scripts/response";
import { arrayContainOnly } from "../scripts/dataCheck";

/**
 * @oas [delete] /location/:location_id
 * description: "Remove a location for the server."
 */
/**
 * @oas [patch] /location/:location_id
 * description: "Edit a location on the server"
 */
new Api({
  url: '/location/:location_id',
  auth: true,
  delete: (request, response) => {
    // Delete from database
    DBcon.query(
      "DELETE FROM `TL_locations` WHERE `location_id`=?",
      [request.params.location_id],
      handleQuery(response, "Something went wrong", () => {
        responseDone(response);
      })
    );
  },
  patch: (request, response) => {
    // Check if there are no bad values
    let objectKeys = Object.keys(request.body);
    const searchArray = [
      "name",
      "place",
      "id"
    ];
    
    arrayContainOnly(objectKeys, searchArray).then(() => {
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
    
        // Custom function for chaning user
        function changeLocation(key: string, req, rejectChange: (error: any) => void) {
          DBcon.query("UPDATE `TL_locations` SET `" + key + "`=? WHERE `location_id`=?", [
            req.body[key],
            request.params.location_id
          ], rejectChange);
        }
    
        // Change each key
        async function changeKey() {
          await Promise.all(objectKeys.map(async (key:string) => {
            changeLocation(key, request, rejectChange);
          }));
    
          // Done?
          if (!hasFailed) {
            resolve();
          }
        }
    
        // Run it async for speed
        changeKey();
      });
    
      // Run the code
      updateUser.then(() => {
        responseDone(response);
      }).catch((message) => {
        response.status(400);
        response.send(JSON.stringify({
          status: 400,
          message: "Could not save the changes. " + message
        }));
      });
    }).catch(() => {
      // Something went wrong
      response.status(400);
      response.send(JSON.stringify({
        status: 400,
        message: 'Please check the documentation.'
      }));
    });
  }
})