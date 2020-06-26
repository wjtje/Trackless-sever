import { Response } from 'express';
import { MysqlError } from 'mysql';
import { responseServerError, responseBadRequest } from './response';
import { DBcon } from '..';

/**
 * Trow an sql error and save it in the database
 * 
 * @since 0.2-beta.1
 * @param {Response} response 
 * @param {MysqlError} error 
 * @param {string} errorMessage 
 */
export function sqlError(response:Response, error:MysqlError, errorMessage:string) {
  // Report to the user
  responseServerError(response, `${errorMessage} - ${error.code}`)

  // Save it in the database
  DBcon.query(
    "INSERT INTO `TL_errors` (`sqlError`, `message`) VALUES (?,?)",
    [
      JSON.stringify(error),
      errorMessage
    ]
  );
}

/**
 * The user is missing something
 * 
 * @since 0.2-beta.1
 * @param {Response} response 
 * @param {Array<string>} missing 
 * @param {Array<string>} typeErr 
 */
export function missingError(response:Response, missing:Array<string>, typeErr:Array<string>) {
  responseBadRequest(response, {
    missing: missing,
    typeErr: typeErr
  });
}