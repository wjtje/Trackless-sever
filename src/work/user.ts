import Api from "../scripts/api";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { TLWork, responseWork } from "./script";
import { checkUserId } from "../scripts/idCheck";

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
  url: '/work/user/:user_id/:start/:end',
  auth: true,
  get: (request, response, user) => {
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
    )
  }
})