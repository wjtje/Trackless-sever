// Copyright (c) 2020 Wouter van der Wal

import { Response } from 'express'
import moment from 'moment'

export interface TLWork {
  workId: number;
  userId: number;
  locationId: number;
  groupId: number;
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
    workId: number;
    user: { userId: number; firstname: string; lastname: string; username: string; groupId: number; groupName: string };
    location: { locationId: number; place: string; name: string; id: string; };
    time: string;
    date: string;
    description: string;
  }[] = []

  result.forEach((workItem) => {
    tmp.push({
      workId: workItem.workId,
      // Add the user info
      user: {
        userId: workItem.userId,
        firstname: workItem.firstname,
        lastname: workItem.lastname,
        username: workItem.username,
        groupId: workItem.groupId,
        groupName: workItem.groupName
      },
      // Add the location info
      location: {
        locationId: workItem.locationId,
        place: workItem.place,
        name: workItem.name,
        id: workItem.id
      },
      // Add the work info
      time: workItem.time,
      date: moment(workItem.date).format('yyyy-MM-DD'),
      description: workItem.description
    })
  })

  response.status(200).json(tmp)
}
