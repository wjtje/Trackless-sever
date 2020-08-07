import { Response } from 'express';
import { MysqlError } from 'mysql';
import { responseServerError, responseBadRequest } from './response';
import { DBcon } from '..';
import { ExpressError } from './interfaces';

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
  responseServerError(response, {
    error: {
      message: errorMessage,
      code: error.code,
    }
  });

  // Save it in the database
  // TODO: Add the user_id to the error
  DBcon.query(
    "INSERT INTO `TL_errors` (`user_id`, `error_code`, `error_message`) VALUES (?,?)",
    [
      0,
      error.code,
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
    error: {
      missing: missing,
      typeErr: typeErr
    },
  });
}

/**
 * Custom function for trowing a server error
 * 
 * @since 0.3-beta.3
 */
export function serverError() {
  return (error: ExpressError, request: Request, response: Response, next) => {
    switch (error.type) {
      // Wrong json data
      case 'entity.parse.failed':
        responseServerError(response, {
          message: 'Please check your json input. Something is wrong',
          body: error.body
        });
        break;
      // New error
      default:
        console.error(error);
        responseServerError(response, {
          message: 'We have never found this error before.'
        });

        // Save to the database
        DBcon.query(
          "INSERT INTO `TL_errors` (`user_id`, `error_code`, `error_message`) VALUES (?,?,?)",
          [
            0,
            error.type,
            'New server error'
          ]
        );
    }
  };
}
