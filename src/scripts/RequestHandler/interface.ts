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
 * @param {number} userId
 * @param {string} username
 * @param {string} firstname
 * @param {string} lastname
 * @param {number} groupId
 */
export interface userInfo {
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  groupId: number;
}