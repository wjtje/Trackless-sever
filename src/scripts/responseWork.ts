// Copyright (c) 2020 Wouter van der Wal

import { Response } from 'express'
import moment from 'moment'

// Define the mysql result type
export interface TLWork {
  workID: number;
  time: number;
  date: string;
  description: string;
  'user.userID': number;
  'user.firstname': string;
  'user.lastname': string;
  'user.username': string;
  'user.groupID': number;
  'user.groupName': string;
  'location.locationID': number;
  'location.place': string;
  'location.name': string;
  'location.id': string;
  'worktype.worktypeID': number;
  'worktype.name': string;
}

/**
 * Converts a mysql result to a valid json response and returns it to the user
 *
 * @since 0.4-beta.4
 * @param result
 * @param response
 */
export function responseWork (result: TLWork[], response:Response) {
  // Create a tmp buffer
  const tmp: {
    workID: number;
    user: { userID: number; firstname: string; lastname: string; username: string; groupID: number; groupName: string };
    location: { locationID: number; place: string; name: string; id: string; };
    worktype: { worktypeID: number; name: string; }
    time: string;
    date: string;
    description: string;
  }[] = []

  // Add each row to the tmp object
  result.forEach((i) => {
    tmp.push({
      workID: i.workID,
      // Add the user info
      user: {
        userID: i['user.userID'],
        firstname: i['user.firstname'],
        lastname: i['user.lastname'],
        username: i['user.username'],
        groupID: i['user.groupID'],
        groupName: i['user.groupName']
      },
      // Add the location info
      location: {
        locationID: i['location.locationID'],
        place: i['location.place'],
        name: i['location.name'],
        id: i['location.id']
      },
      // Add the worktype info
      worktype: {
        worktypeID: i['worktype.worktypeID'],
        name: i['worktype.name']
      },
      // Add the work info
      time: String(i.time),
      date: moment(i.date).format('yyyy-MM-DD'),
      description: i.description
    })
  })

  // Return in to the user
  response.status(200).json(tmp)
}
