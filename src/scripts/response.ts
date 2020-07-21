import { Response } from 'express';
import { request200, request201, request400, request403, request404, request500 } from '../global/language';

/**
 * Inform the user that their call was successful
 * 
 * @since 0.2-beta.1
 * @param {Response} response
 * @param {object} result
 */
export function responseDone(response:Response, result?: object) {
  response.type('json');
  response.send(JSON.stringify({
    info: {
      status: 200,
      message: request200,
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
  response.type('json');
  response.status(201);
  response.send(JSON.stringify({
    info: {
      status: 201,
      message: request201,
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
  response.type('json');
  response.status(400);
  response.send(JSON.stringify({
    info: {
      status: 400,
      message: request400,
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
  response.type('json');
  response.status(403);
  response.send(JSON.stringify({
    info: {
      status: 403,
      message: request403,
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
  response.type('json');
  response.status(404);
  response.send(JSON.stringify({
    info: {
      status: 404,
      message: request404
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
  response.type('json');
  response.status(500);
  response.send(JSON.stringify({
    info: {
      status: 500,
      message: request500,
    },
    ...(error)? error: null,
  }));
}