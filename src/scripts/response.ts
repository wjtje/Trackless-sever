import { Response } from 'express';

/**
 * Inform the user that their call was successful
 * 
 * @since 0.2-beta.1
 * @param {Response} response
 * @param {object} result
 */
export function responseDone(response:Response, result?: object) {
  response.send(JSON.stringify({
    info: {
      status: 200,
      message: 'Success.',
    },
    ...(result)? result: null,
  }));
}

/**
 * Inform the user that the resource has been created
 * 
 * @since 0.2-beta.2
 * @param {Response} response 
 * @param {object} createResult
 */
export function responseCreated(response:Response, createResult?:object) {
  // #/components/responses/201
  response.status(201);
  response.send(JSON.stringify({
    info: {
      status: 201,
      message: 'Your request has been fulfilled.',
    },
    ...(createResult)? createResult: null,
  }));
}

/**
 * Inform the user that there is something wrong with their request
 * 
 * @since 0.2-beta.1
 * @param {Response} response 
 * @param {object} error More details about the error that happend
 */
export function responseBadRequest(response:Response, error?: object) {
  response.status(400);
  response.send(JSON.stringify({
    info: {
      status: 400,
      message: 'There is something wrong with your request.',
    },
    ...(error)? error: null,
  }));
}

/**
 * Inform the user that he/she has no access
 * 
 * @since 0.2-beta.1
 * @param {Response} response
 */
export function responseForbidden(response:Response) {
  response.status(403);
  response.send(JSON.stringify({
    info: {
      status: 403,
      message: 'You don\'t have access to do this request.',
    },
  }));
}

/**
 * Inform the user that the resource was not found
 * 
 * @since 0.2-beta.1
 * @param {Response} response 
 */
export function responseNotFound(response:Response) {
  response.status(404);
  response.send(JSON.stringify({
    info: {
      status: 404,
      message: 'The resource you are looking for is not here.'
    }
  }));
}

/**
 * Inform the user that something internaly went wrong
 * 
 * @since 0.2-beta.1
 * @param {Response} response
 * @param {object} error More details about the error that happend
 */
export function responseServerError(response:Response, error?: object) {
  response.status(500);
  response.send(JSON.stringify({
    info: {
      status: 500,
      message: ' Something internally went wrong.',
    },
    ...(error)? error: null,
  }));
}