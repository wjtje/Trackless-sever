import { Request, Response } from "express";
import { number } from "./types";
import { DBcon } from "..";
import { handleQuery } from "./handle";
import { responseNotFound, responseBadRequest } from "./response";
import { userInfo } from "../scripts/interfaces";
import _ = require("lodash");

/**
 * Checks if the access id exsist
 * 
 * @since 0.2-beta.2
 * @param {Request} request
 * @param {Response} response
 * @param {() => void} then
 */
export function checkAccessId(request:Request, response:Response, then: () => void) {
  if (number(request.params.access_id)) {
    // Access is a number
    DBcon.query(
      "SELECT `access_id` FROM `TL_access` WHERE `access_id`=?",
      [request.params.access_id],
      handleQuery(response, (result) => {
        if (result.length === 0) {
          // Access is not found
          responseNotFound(response);
        } else {
          // Access is found move on
          then();
        }
      })
    );
  } else {
    responseBadRequest(response, {
      error: {
        message: 'Access_id needs to be a number.'
      }
    });
  }
}

/**
 * Checks if the api id exsist
 * 
 * @since 0.2-beta.2
 * @param {Request} request 
 * @param {Response} response 
 * @param {userInfo} user
 * @param {() => void} then 
 */
export function checkApiId(request:Request, response:Response, user:userInfo, then: () => void) {
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

/**
 * Checks if the group id exsist
 * 
 * @since 0.2-beta.2
 * @param {Request} request
 * @param {Response} response
 * @param {() => void} then 
 */
export function checkGroupId(request:Request, response:Response, then: () => void) {
  // Check if api_id is a number
  if (number(request.params.group_id)) {
    DBcon.query(
      "SELECT `group_id` FROM `TL_groups` WHERE `group_id`=?",
      [request.params.group_id],
      handleQuery(response, (result) => {
        if (result.length === 0) {
          // The group does not exsist
          responseNotFound(response);
        } else {
          then();
        }
      })
    )
  } else if (request.params.group_id == '~') {
    then();
  } else {
    // Bad request group_id is not a number
    responseBadRequest(response, {
      error: {
        message: `group_id needs to be a valid number`
      }
    })
  }
}

/**
 * Checks if the location id exsist
 * 
 * @since 0.2-beta.2
 * @param {Request} request
 * @param {Response} response
 * @param {() => void} then
 */
export function checkLocationId(request:Request, response:Response, then: () => void) {
  if (number(request.params.location_id)) {
    DBcon.query(
      "SELECT `location_id` FROM `TL_locations` WHERE `location_id`=?",
      [request.params.location_id],
      handleQuery(response, (result) => {
        if (result.length === 0) {
          // The location does not exsist
          responseNotFound(response);
        } else {
          then();
        }
      })
    )
  } else {
    responseBadRequest(response, {
      error: {
        message: 'Your location_id is not correct'
      }
    });
  }
}

/**
 * Checks if the user id exsist
 * 
 * @since 0.2-beta.2
 * @param {Request} request
 * @param {Response} response
 * @param {() => void} then
 */
export function checkUserId(request:Request, response:Response, then: () => void) {
  if (number(request.params.user_id)) {
    DBcon.query(
      "SELECT `user_id` FROM `TL_users` WHERE `user_id`=?",
      [request.params.user_id],
      handleQuery(response, (result) => {
        if (result.length === 0) {
          // The user does not exsist
          responseNotFound(response);
        } else {
          then();
        }
      })
    )
  } else if (request.params.user_id == '~') {
    // Your self does always exsist
    then();
  } else {
    responseBadRequest(response, {
      error: {
        message: 'Your user_id is not correct'
      }
    });
  }
}

/**
 * Checks if the work id exsist
 * 
 * @since 0.3-beta.1
 * @param {Request} request
 * @param {Response} response
 * @param {() => void} then
 */
export function checkWorkId(request:Request, response:Response, then: () => void) {
  if (number(request.params.work_id)) {
    DBcon.query(
      "SELECT `work_id` FROM `TL_work` WHERE `work_id`=?",
      [request.params.work_id],
      handleQuery(response, (result) => {
        if (result.length === 0) {
          // The work does not exsist
          responseNotFound(response);
        } else {
          then();
        }
      })
    )
  } else {
    responseBadRequest(response, {
      error: {
        message: 'Your work_id is not correct'
      }
    });
  }
}

/**
 * Checks if the work id exsist
 * 
 * @since 0.3-beta.1
 * @param {Request} request
 * @param {Response} response
 * @param {() => void} then
 */
export function checkWorkIdUser(request:Request, response:Response, user:userInfo, then: () => void) {
  checkUserId(request, response, () => {
    // Check the work id
    if (number(request.params.work_id)) {
      DBcon.query(
        "SELECT `work_id` FROM `TL_work` WHERE `work_id`=? AND `user_id`=?",
        [request.params.work_id, (request.params.user_id == '~')? user.user_id:request.params.user_id,],
        handleQuery(response, (result) => {
          if (result.length === 0) {
            // The work does not exsist
            responseNotFound(response);
          } else {
            then();
          }
        })
      )
    } else {
      responseBadRequest(response, {
        error: {
          message: 'Your work_id is not correct'
        }
      });
    }
  });
}