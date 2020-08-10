import { responseDone } from "../../scripts/response";
import { Response } from "express";
import moment from 'moment';

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
export function responseWork(result: TLWork[], response:Response) {
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
      date: moment(workItem.date).format("yyyy-MM-DD"),
      description: workItem.description,
    });
  });

  responseDone(response, {
    length: tmp.length,
    result: tmp,
  });
}