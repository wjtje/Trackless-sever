// Copyright (c) 2020 Wouter van der Wal

export interface Access {
	accessID: number;
	access: string;
}

export interface Api {
	apiID: number;
	createDate: string;
	lastUsed: string;
	deviceName: string;
}

export interface User {
	userID: number;
	firstname: string;
	lastname: string;
	username: string;
	groupID: number;
	groupName: string;
}

export interface Group {
	groupID: number;
	groupName: string;
	users: User[];
}

export interface Setting {
	groupID: number;
	groupName: string;
	settingID: number;
	setting: string;
	value: string;
}

export interface Location {
	locationID: number;
	hidden: 0 | 1;
	name: string;
	place: string;
	id: string;
	time: number;
}

export interface Worktype {
	worktypeID: number;
	name: string;
}

export interface Work {
	workID: number;
	time: number;
	date: string;
	description: string;
	user: User;
	location: Location;
	worktype: Worktype;
}
