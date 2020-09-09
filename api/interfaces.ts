// Copyright (c) 2020 Wouter van der Wal

export interface Access {
  accessId: number;
  access: string;
}

export interface Api {
  apiId: number;
  createDate: string;
  lastUsed: string;
  deviceName: string;
}

export interface User {
  userId: number;
  firstname: string;
  lastname: string;
  username: string;
  groupId: number;
  groupName: string;
}

export interface Group {
  groupId: number;
  groupName: string;
  users: User[];
}

export interface Location {
  locationId: number;
  hidden: 0 | 1;
  name: string;
  place: string;
  id: string;
}

export interface Worktype {
  worktypeId: number;
  name: string;
}

export interface Work {
  workId: number;
  time: number;
  date: string;
  description: string;
  user: User;
  location: Location;
  worktype: Worktype;
}
