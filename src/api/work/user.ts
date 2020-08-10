import Api from "../../scripts/api";
import { DBcon } from "../../";
import { handleQuery } from "../../scripts/handle";
import { TLWork, responseWork } from "./script";
import { checkUserId, checkWorkIdUser } from "../../scripts/idCheck";
import { responseDone } from "../../scripts/response";
import { itemPatch, handlePatchRequest } from "../../scripts/patch";

new Api({
  url: '/work/user/:user_id',
  auth: true,
  get: (request, response, user) => {
    checkUserId(request, response, () => {
      // Get all the work for that user
      DBcon.query(
        "SELECT `work_id`, `user_id`, `location_id`, `group_id`, `time`, `date`, `description`, `name`, `place`, `id`, `firstname`, `lastname`, `username`, `groupName` FROM `TL_work` INNER JOIN `TL_users` USING (`user_id`) INNER JOIN `TL_locations` USING (`location_id`) INNER JOIN `TL_groups` USING (`group_id`) WHERE `user_id`=? ORDER BY `date` LIMIT 2000",
        [(request.params.user_id == '~')? user.user_id:request.params.user_id],
        handleQuery(response, (result:Array<TLWork>) => {
          responseWork(result, response);
        })
      );
    });
  },
});

new Api({
  url: '/work/user/:user_id/date/:start/:end',
  auth: true,
  get: (request, response, user) => {
    checkUserId(request, response, () => {
      // Get all the work for that user
      DBcon.query(
        "SELECT `work_id`, `user_id`, `location_id`, `group_id`, `time`, `date`, `description`, `name`, `place`, `id`, `firstname`, `lastname`, `username`, `groupName` FROM `TL_work` INNER JOIN `TL_users` USING (`user_id`) INNER JOIN `TL_locations` USING (`location_id`) INNER JOIN `TL_groups` USING (`group_id`) WHERE `user_id`=? AND `date` >= ? AND `date` <= ? ORDER BY `date` LIMIT 2000",
        [
          (request.params.user_id == '~')? user.user_id:request.params.user_id,
          request.params.start,
          request.params.end
        ],
        handleQuery(response, (result:Array<TLWork>) => {
          responseWork(result, response);
        })
      );
    });
  }
});

new Api({
  url: '/work/user/:user_id/:work_id',
  auth: true,
  get: (request, response, user) => {
    checkWorkIdUser(request, response, user, () => {
      // Get the info from the database
      DBcon.query(
        "SELECT `work_id`, `user_id`, `location_id`, `group_id`, `time`, `date`, `description`, `name`, `place`, `id`, `firstname`, `lastname`, `username`, `groupName` FROM `TL_work` INNER JOIN `TL_users` USING (`user_id`) INNER JOIN `TL_locations` USING (`location_id`) INNER JOIN `TL_groups` USING (`group_id`) WHERE `user_id`=? AND `work_id`=? ORDER BY `date` LIMIT 2000",
        [
          (request.params.user_id == '~')? user.user_id:request.params.user_id,
          request.params.work_id
        ],
        handleQuery(response, (result:Array<TLWork>) => {
          responseWork(result, response);
        })
      );
    });
  },
  delete: (request, response, user) => {
    checkWorkIdUser(request, response, user, () => {
      // Get the info from the database
      DBcon.query(
        "DELETE FROM `TL_work` WHERE `user_id`=? AND `work_id`=?",
        [
          (request.params.user_id == '~')? user.user_id:request.params.user_id,
          request.params.work_id
        ],
        handleQuery(response, () => {
          responseDone(response);
        })
      );
    });
  },
  patch: (request, response, user) => {
    checkWorkIdUser(request, response, user, () => {
      itemPatch(request, response, [
        "location_id",
        "time",
        "date",
        "description",
      ], (key, resolve, reject) => {
        // Create a custom function for changing the work object
        function changeWork() {
          DBcon.query("UPDATE `TL_work` SET `" + key + "`=? WHERE `work_id`=? AND `user_id`=?", [
            request.body[key],
            request.params.work_id,
            (request.params.user_id == '~')? user.user_id:request.params.user_id,
          ], handlePatchRequest(reject, resolve));
        }

        // Check if location id exsist
        if (key == "location_id") {
          DBcon.query("SELECT `location_id` FROM `TL_locations` WHERE `location_id`=?",
          [request.body[key]],
          handleQuery(response, (result) => {
            if (result.length == 0) {
              reject();
            } else {
              changeWork();
            }
          }))
        } else {
          changeWork();
        }
      });
    });
  }
});