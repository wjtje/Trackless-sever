import { reqDataObj, reqDataCheck, apiCheck } from "./scripts";
import { Request, Response, response } from 'express';
import { server } from './index';
import { apiLogin } from "./api/lib";
import _ = require("lodash");
import { checkAccess } from "./access/lib";
import passport = require("passport");

interface RequestLocal extends Request {
  user: {
    user_id: number;
    username: string;
    firstname: string;
    lastname: string;
    group_id: number;
  }
}

export function newApi(
  method: "get" | "post" | "delete" | "patch",
  url: string,
  require: Array<reqDataObj>,
  resolve: (request: RequestLocal, response: Response, userInfo?: { user_id: number; username: string; firstname: string; lastname: string; group_id: number; }) => void,
  reject: (reason: string, method?: "get" | "post" | "delete" | "patch", url?: string, response?: Response, status?: number) => void,
) {
  // Check if the types are correct
  if (!["get","post","delete","patch"].includes(method)) {
    reject(`Method can not be type '${method}'`);
  }

  if (typeof url !== "string") {
    reject(`Url needs to be a string.`);
  }

  if (typeof require !== "object") {
    reject(`Require needs to be an object.`);
  }

  // Does the api need to be checked?
  let apiCheck = _.findIndex(require, ['name', 'bearer']) !== -1;

  // Function that wil run if the api is called
  let apiFun = (request: RequestLocal, response: Response) => {
    reqDataCheck(request, response, require, () => {
      // Check if we need to check the api key
      if (_.findIndex(require, ['name', 'bearer']) !== -1) {
        checkAccess(request.user.group_id, method, url).then(() => {
          resolve(request, response, request.user);
        }).catch(() => {
          reject('No access', method, url, response, 403);
        });
      } else {
        // No api is given
        resolve(request, response);
      }
    }, () => {
      reject(`Client ERR.`, method, url)
    });
  }

  // Bind the function
  if (apiCheck) {
    server[method](
      url,
      passport.authenticate('bearer', {session: false}),
      apiFun
    );
  } else {
    server[method](
      url,
      apiFun
    );
  }
}

// Handle reject
export function handleReject() {
  return (reason, method, url, response, status) => {
    // Something went wrong
    console.error(`${method} ${url} ${reason}`);
    
    if (response) {
      response.status((status == undefined)? 400:status);
      response.send(JSON.stringify({
        status: (status == undefined)? 400:status,
        message: `Something went wrong. (${reason})`
      }));
    }
  };
}
