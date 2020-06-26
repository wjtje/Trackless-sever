import { requireObject } from "./interfaces";
import { Request, Response } from "express";
import * as _ from "lodash";

/**
 * Check of the request contains all the required data
 * 
 * @since 0.2-beta.1
 * @param request 
 * @param response 
 * @param require 
 */
export function requiredDataCheck(request:Request, response:Response, require:Array<requireObject>) : Promise<boolean> {
  // Global vars
  let failed = false;
  let missing:string[] = [];
  let typeErr:string[] = [];

  return new Promise(async (resolve, reject) => {
    await Promise.all(require.map(async (i) => {
      if (!_.has(request.body, i.name) && !_.has(request.params, i.name)) {
        // Return to the user that something is missing
        failed = true;
        missing.push(i.name);
      } else if (
        !i.check(_.get(request.body, i.name)) &&
        !i.check(_.get(request.params, i.name))
      ) {
        // Return to the user that the type is not correct
        failed = true;
        typeErr.push(i.name);
      }
    }));

    // Did we fail?
    if (failed) {
      reject([missing, typeErr]);
    } else {
      resolve(true);
    }
  });
}

/**
 * Checks if there are no bad keys in the first array using the second array
 * 
 * @since 0.2-beta.1
 * @param array 
 * @param searchList 
 */
export function arrayContainOnly(array: Array<string>, searchList: Array<string>) {
  return new Promise((resolve, reject) => {
    let isRejected = false;

    array.forEach(item => {
      if (!searchList.includes(item)) {
        isRejected = true;
        reject();
      }
    });
    
    if (!isRejected) {
      resolve();
    }
  });
}
