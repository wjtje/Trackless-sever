import { responseDone } from "../scripts/response";
import Api from "../scripts/api";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { Response } from 'express';

export interface TLWork {
  work_id:     number;
  user_id:     number;
  location_id: number;
  group_id:    number;
  time:        string;
  date:        string;
  description: string;
  name:        string;
  place:       string;
  id:          string;
  firstname:   string;
  lastname:    string;
  username:    string;
  groupName:   string;
}

/**
 * Custom function for returning work
 * 
 * @since 0.2-beta.1
 * @param result 
 * @param response 
 */
function responseWork(result: TLWork[], response:Response) {
  let tmp: {
    work_id: number;
    user: { user_id: number; firstname: string; lastname: string; username: string; };
    group: { group_id: number; groupName: string; };
    location: { location_id: number; place: string; name: string; id: string; };
    time: string; date: string;
    description: string;
  }[] = [];

  result.forEach((workItem) => {
    tmp.push({
      work_id: workItem.work_id,
      // Add the user info
      user: {
        user_id: workItem.user_id,
        firstname: workItem.firstname,
        lastname: workItem.lastname,
        username: workItem.username,
      },
      // Add the group info
      group: {
        group_id: workItem.group_id,
        groupName: workItem.groupName,
      },
      // Add the location info
      location: {
        location_id: workItem.location_id,
        place: workItem.place,
        name: workItem.name,
        id: workItem.id,
      },
      // Add the work info
      time: workItem.time,
      date: String(workItem.date).split("T")[0],
      description: workItem.description,
    });
  });

  responseDone(response, {
    result: tmp
  });
}

/**
 * @oas [get] /work/user/:user_id
 * description: "Get all the work for a user."
 */
new Api({
  url: '/work/user/:user_id',
  auth: true,
  get: (request, response, user) => {
    // Get all the work for that user
    DBcon.query(
      "SELECT `work_id`, `user_id`, `location_id`, `group_id`, `time`, `date`, `description`, `name`, `place`, `id`, `firstname`, `lastname`, `username`, `groupName` FROM `TL_work` INNER JOIN `TL_users` USING (`user_id`) INNER JOIN `TL_locations` USING (`location_id`) INNER JOIN `TL_groups` USING (`group_id`) WHERE `user_id`=? ORDER BY `date` LIMIT 2000",
      [(request.params.user_id == '~')? user.user_id:request.params.user_id],
      handleQuery(response, "Something went wrong", (result:Array<TLWork>) => {
        responseWork(result, response);
      })
    );
  },
});

/**
 * @oas [get] /work/user/:user_id/:start/:end
 * description: "Get all the work for a user within a date limit."
 */
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
      handleQuery(response, "Something went wrong", (result:Array<TLWork>) => {
        responseWork(result, response);
      })
    )
  }
})