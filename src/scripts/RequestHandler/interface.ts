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
 * @param {number} user_id
 * @param {string} username
 * @param {string} firstname
 * @param {string} lastname
 * @param {number} group_id
 */
export interface userInfo {
  user_id: number;
  username: string;
  firstname: string;
  lastname: string;
  group_id: number;
}