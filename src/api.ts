import { reqDataObj, reqDataCheck, apiCheck } from "./scripts";
import { Request, Response, response } from 'express';
import { server } from './index';
import { apiLogin } from "./api/lib";
import _ = require("lodash");
import { checkAccess } from "./access/lib";

export function newApi(
  method: "get" | "post" | "delete" | "patch",
  url: string,
  require: Array<reqDataObj>,
  resolve: (request: Request, response: Response, userInfo?: { user_id: number; username: string; firstname: string; lastname: string; group_id: number; }) => void,
  reject: (reason: string, response?: Response, method?: "get" | "post" | "delete" | "patch", url?: string) => void,
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

  // Function that wil run if the api is called
  let apiFun = (request: Request, response: Response) => {
    reqDataCheck(request, response, require, () => {
      // Check if we need to check the api key
      if (_.findIndex(require, ['name', 'apiKey']) !== -1) {
        // Try loggin in with that api key
        apiLogin(request.body.apiKey).then((userInfo) => {
          // Check if the user has access running that command
          checkAccess(userInfo.group_id, method, url).then(() => {
            resolve(request, response, userInfo);
          }).catch((reason) => {
            reject(reason, response, method, url);
          });
        }).catch((reason) => {
          reject(reason, response, method, url);
        });
      } else {
        // No api is given
        resolve(request, response);
      }
    }, () => {
      reject(`Client ERR.`)
    });
  }

  // Bind the function
  server[method](url, apiFun);
}

// Handle reject
export function handleReject() {
  return (reason, response, method, url) => {
    // Something went wrong
    console.error(`${method} ${url} ${reason}`);
    
    if (response) {
      response.send(JSON.stringify({
        status: 400,
        message: `Something went wrong. (${reason})`
      }));
      response.status(400);
    }
  };
}
