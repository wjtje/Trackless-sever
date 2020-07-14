import { Request, Response } from 'express';

/**
 * @since 0.2-beta.1
 * @param {string} salt A random string
 * @param {string} hash The hash of your password + the salt
 */
export interface hashedPassword {
  salt: string;
  hash: string;
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
 * A collection of {requireObject} for each method
 * 
 * @since 0.2-beta.1
 */
export interface requireObjectMethod {
  get?: Array<requireObject>;
  post?: Array<requireObject>;
  patch?: Array<requireObject>;
  delete?: Array<requireObject>;
}

/**
 * @since 0.2-beta.1
 * @param {Array<string>} get All the permissions needed for the get callback
 * @param {Array<string>} post All the permissions needed for the post callback
 * @param {Array<string>} patch All the permissions needed for the patch callback
 * @param {Array<string>} delete All the permissions needed for the delete callback
 */
export interface permissionsObject {
  get?: Array<string>;
  post?: Array<string>;
  patch?: Array<string>;
  delete?: Array<string>;
}

/**
 * @since 0.2-beta.1
 * @param {string} url The url that the user will navigate to.
 * @param {Array<requireObject>} require Data your api requires.
 * @param {boolean} auth Shoud the user be authenticated.
 * @param {Array<string>} permissions What permissions does the user need to use this api call.
 * @param {(request:Request, response:Response, userInfo:userInfo) => void} get The callback for the get method
 * @param {(request:Request, response:Response, userInfo:userInfo) => void} post The callback for the post method
 * @param {(request:Request, response:Response, userInfo:userInfo) => void} patch The callback for the patch method
 * @param {(request:Request, response:Response, userInfo:userInfo) => void} delete The callback for the delete method
 */
export interface apiObject {
  url: string;
  require?: requireObjectMethod;
  auth?: boolean;
  permissions?: permissionsObject;
  get?: (request:Request, response:Response, userInfo?:userInfo) => void;
  post?: (request:Request, response:Response, userInfo?:userInfo) => void;
  patch?: (request:Request, response:Response, userInfo?:userInfo) => void;
  delete?: (request:Request, response:Response, userInfo?:userInfo) => void;
}

/**
 * Custom Request interface with the user object
 * 
 * @since 0.2-beta.1
 */
export interface RequestLocal extends Request {
  user: {
    user_id: number;
    username: string;
    firstname: string;
    lastname: string;
    group_id: number;
  }
}

/**
 * Custom interface for the express error object
 * 
 * @since 0.3-beta.3
 */
export interface ExpressError {
  expose:     boolean;
  statusCode: number;
  status:     number;
  body:       string;
  type:       string;
}
