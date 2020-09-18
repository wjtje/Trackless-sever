// Copyright (c) 2020 Wouter van der Wal

import { Response } from 'express'
import moment from 'moment'

export interface TLWork {
  workID: number;
  userID: number;
  locationID: number;
  groupID: number;
  time: string;
  date: string;
  description: string;
  name: string;
  place: string;
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  groupName: string;
  worktypeID: number;
  wname: string;
}

/**
 * Custom function for returning work
 *
 * @since 0.2-beta.1
 * @param result
 * @param response
 */
export function responseWork (result: TLWork[], response:Response) {
  const tmp: {
    workID: number;
    user: { userID: number; firstname: string; lastname: string; username: string; groupID: number; groupName: string };
    location: { locationID: number; place: string; name: string; id: string; };
    worktype: { worktypeID: number; name: string; }
    time: string;
    date: string;
    description: string;
  }[] = []

  result.forEach((workItem) => {
    tmp.push({
      workID: workItem.workID,
      // Add the user info
      user: {
        userID: workItem.userID,
        firstname: workItem.firstname,
        lastname: workItem.lastname,
        username: workItem.username,
        groupID: workItem.groupID,
        groupName: workItem.groupName
      },
      // Add the location info
      location: {
        locationID: workItem.locationID,
        place: workItem.place,
        name: workItem.name,
        id: workItem.id
      },
      // Add the worktype info
      worktype: {
        worktypeID: workItem.worktypeID,
        name: workItem.wname
      },
      // Add the work info
      time: workItem.time,
      date: moment(workItem.date).format('yyyy-MM-DD'),
      description: workItem.description
    })
  })

  response.status(200).json(tmp)
}
