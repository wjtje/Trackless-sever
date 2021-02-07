// Copyright (c) 2020 Wouter van der Wal

/**
 * @since 0.2-beta.1
 * @param {string} name The name of the required data
 * @param {(testvalue: any) => boolean} check A function for checking the data
 */
export interface requireObject {
	name: string;
	check: (testvalue: any) => boolean;
}

/**
 * @since 0.2-beta.1
 * @param {number} userID
 * @param {string} username
 * @param {string} firstname
 * @param {string} lastname
 * @param {number} groupID
 */
export interface userInfo {
	userID: number;
	username: string;
	firstname: string;
	lastname: string;
	groupID: number;
}
