import Api from "../scripts/api";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseDone, responseNotFound, responseBadRequest } from "../scripts/response";
import { Request, Response } from "express";
import { number } from "../scripts/types";
import { userInfo } from "../scripts/interfaces";

interface TL_api {
  api_id: number;
  createDate: string;
  lastUsed: string;
  deviceName: string;
}

/**
 * @since 0.2-beta.2
 * @param {Request} request 
 * @param {Response} response 
 * @param {userInfo} user
 * @param {() => void} then 
 */
function checkApiId(request:Request, response:Response, user:userInfo, then: () => void) {
  // Check if api_id is a number
  if (number(request.params.api_id)) {
    DBcon.query(
      "SELECT `api_id` FROM `TL_apikeys` WHERE `api_id`=? and `user_id`=?",
      [request.params.api_id, user.user_id],
      handleQuery(response, (result) => {
        if (result.length === 0) {
          // The api key does not exsist
          responseNotFound(response);
        } else {
          then();
        }
      })
    )
  } else {
    // Bad request api_id is not a number
    responseBadRequest(response, {
      error: {
        message: `api_id needs to be a valid number`
      }
    })
  }
}

new Api({
  url: '/api/:api_id',
  auth: true,
  get: (request, response, user) => {
    checkApiId(request, response, user, () => {
      // Api_id is valid return info
      DBcon.query(
        "SELECT `api_id`, `createDate`, `lastUsed`, 'deviceName' FROM `TL_apikeys` WHERE `api_id`=? and `user_id`=?",
        [request.params.api_id, user.user_id],
        handleQuery(response, (result: Array<TL_api>) => {
          responseDone(response, {
            length: result.length,
            result: result,
          });
        })
      );
    });
  },
  delete: (request, response, user) => {
    checkApiId(request, response, user, () => {
      // Api_id is valid remove it
      DBcon.query(
        "DELETE FROM `TL_apikeys` WHERE `api_id`=? and `user_id`=?",
        [request.params.api_id, user.user_id],
        handleQuery(response, () => {
          responseDone(response);
        })
      );
    });
  }
});