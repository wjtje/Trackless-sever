import { DBcon } from '../index';
import { sha512_256 } from 'js-sha512';
import { accountNotFound } from '../global/language';

/**
 * Check the api key in the database
 * 
 * @since 0.2-beta.1
 * @param apiKey 
 */
export function apiLogin(apiKey:string):Promise<{
  user_id: number;
  username: string;
  firstname: string;
  lastname: string;
  group_id: number;
}> {
  return new Promise((resolve, reject) => {
    // Check the api key
    DBcon.query(
      "SELECT `user_id`, `username`, `firstname`, `lastname`, `group_id` FROM `TL_apikeys` INNER JOIN `TL_users` USING (`user_id`) WHERE apiKey=?",
      [ sha512_256(apiKey) ],
      (error, result) => {
        if (error || result.length == 0) { // An sql error or invalid api key
          // Internal error
          DBcon.query(
            "INSERT INTO `TL_errors` (`sqlError`, `message`) VALUES (?,?)",
            [
              JSON.stringify(error),
              'None'
            ]
          );

          // Reject the request
          reject(
            (error)? error.code : accountNotFound
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
                  "INSERT INTO `TL_errors` (`sqlError`, `message`) VALUES (?,?)",
                  [
                    JSON.stringify(error),
                    'None'
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