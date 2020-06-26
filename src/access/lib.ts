/**
 * Rules for access
 * group_id 0 (default) No access
 * group_id 1 (admin) All access
 */

import { DBcon } from "..";

export function checkAccess(group_id: number, method: string, url: string) : Promise<string> {
  return new Promise((resolve, reject) => {
    if (group_id === 0) {
      reject('group_id 0 does not have any access.');
    } else if (group_id === 1) {
      resolve();
    } else {
      DBcon.query("SELECT `access_id` FROM `TL_access` WHERE `group_id`=? AND `method`=? AND `url`=?",
      [
        group_id,
        method,
        url
      ], (error, result) => {
        if (error) {
          reject();
        } else if (result.length === 0) {
          reject('You don\'t have access to do that');
        } else {
          resolve();
        }
      })
    }
  });
}