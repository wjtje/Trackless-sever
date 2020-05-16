// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { loginFault, apiCheck, handleQuery, responseDone, reqDataCheck, storePassword } from '../scripts';
import { apiLogin } from '../api/lib';

// Import other modules
import * as _ from 'lodash';

// Interfaces
export interface TL_user {
  user_id:   number;
  firstname: string;
  lastname:  string;
  username:  string;
  group_id:  number;
  groupName: string;
}

// List all users
server.get('/user', (req, res) => {
  apiCheck(req, res, () => {
    // Get all the users
    DBcon.query(
      "SELECT `user_id`, `firstname`, `lastname`, `username`, `group_id`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`group_id`)",
      handleQuery(res, 'Couldn\'t select all the users.', (result: Array<TL_user>) => {
        responseDone(res, {
          result: result
        })
      })
    );
  });
});

// Create a new user
server.post('/user', (req, res) => {
  reqDataCheck(req, res, [
    "firstname",
    "lastname",
    "username",
    "password",
    "group_id",
  ], () => {
    apiLogin(req.body.apiKey).then(() => {
      // Check if the user is taken
      DBcon.query(
        "SELECT `username` FROM `TL_users` WHERE `username`=?",
        [
          req.body.username
        ],
        handleQuery(res, `Something went wrong while checking the user name = '${req.body.username}'`, (result) => {
          if (result.length > 0) { // Username is taken
            res.send(JSON.stringify({
              status: 400,
              message: 'Username is taken.',
            }));
    
            res.status(400);
          } else {  // Every things good
            // Create a new user
            const [salt, hash] = storePassword(req.body.password);

            // Commit to the database
            DBcon.query(
              "INSERT INTO `TL_users` ( `firstname`, `lastname`, `username`, `group_id`, `salt_hash`, `hash` ) VALUES ( ?, ?, ?, ?, ?, ?)",
              [
                req.body.firstname,
                req.body.lastname,
                req.body.username,
                Number(req.body.group_id),
                salt,
                hash
              ],
              handleQuery(res, 'Couldn\'t save the user into the database. Please try again later', (result) => {
                // User has been created
                responseDone(res, {
                  user_id: result.insertId
                });
              })
            );
          }
        })
      );
    }).catch(loginFault(res));
  });
});
