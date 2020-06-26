import { Response } from 'express';

/**
 * Inform the user that their call was successful
 * 
 * @since 0.2-beta.1
 * @param {Response} response
 * @param {object} result
 */
export function responseDone(response:Response, result?: object) {
  if (result) {
    response.send(JSON.stringify({
      status: 200,
      message: 'done',
      ...result
    }));
  } else {
    response.send(JSON.stringify({
      status: 200,
      message: 'done'
    }));
  }
}

/**
 * Inform the user that there is something wrong with theire request
 * 
 * @since 0.2-beta.1
 * @param {Response} response 
 * @param {string|object} message 
 */
export function responseBadRequest(response:Response, message?:string|object) {
  response.status(400);
  response.send(JSON.stringify({
    status: 400,
    message: (message)? message:'Bad request'
  }));
}

/**
 * Inform the user that he/she has no access
 * 
 * @since 0.2-beta.1
 * @param {Response} response 
 * @param {object} message 
 */
export function responseForbidden(response:Response, message?:string) {
  response.status(400);
  response.send(JSON.stringify({
    status: 400,
    message: (message)? message:'You don\'t have access to do that'
  }));
}

/**
 * Inform the user that the resource was not found
 * 
 * @since 0.2-beta.1
 * @param {Response} response 
 * @param {object} message 
 */
export function responseNotFound(response:Response, message?: string) {
  response.status(404);
  response.send(JSON.stringify({
    status: 404,
    message: (message)? message:'Not found'
  }));
}

/**
 * Inform the user that something internaly went wrong
 * 
 * @since 0.2-beta.1
 * @param {Response} response 
 * @param {object} message 
 */
export function responseServerError(response:Response, message?: string) {
  response.status(500);
  response.send(JSON.stringify({
    status: 500,
    message: (message)? message:'Internal server error'
  }));
}