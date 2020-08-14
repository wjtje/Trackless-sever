import { DBcon } from '../index';
import { sha512_256 } from 'js-sha512';
import { get as _get } from 'lodash';

/**
 * Check the api key in the database
 * 
 * @since 0.2-beta.1
 * @param apiKey 
 */
export function apiLogin(apiKey:string):Promise<{
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  groupId: number;
}> {
  return new Promise((resolve, reject) => {
    // Check the api key
    DBcon.query(
      "SELECT `userId`, `username`, `firstname`, `lastname`, `groupId` FROM `TL_apikeys` INNER JOIN `TL_users` USING (`userId`) WHERE apiKey=?",
      [ sha512_256(apiKey) ],
      (error, result) => {
        if (error || result.length == 0) { // An sql error or invalid api key
          // Internal error
          DBcon.query(
            "INSERT INTO `TL_errors` (`userId`, `error_code`, `error_message`) VALUES (?,?,?)",
            [
              0,
              _get(error, 'code', 'Wrong api key'),
              'Api key not found or internal error'
            ]
          );

          // Reject the request
          reject(
            (error)? error.code : 'account not found'
          );
        } else {
          // Api key is correct
          // Update the last used
          DBcon.query(
            "UPDATE `TL_apikeys` SET `lastUsed`=CURRENT_TIMESTAMP WHERE `apiKey`=?",
            [ sha512_256(apiKey) ],
            (error) => {
              // Document the error
              if (error) {
                DBcon.query(
                  "INSERT INTO `TL_errors` (`userId`, `error_code`, `error_message`) VALUES (?,?,?)",
                  [
                    0,
                    error.code,
                    'Something went wrong'
                  ]
                );
              }
            }
          );

          resolve(result[0]);
        }
      }
    );
  });
}