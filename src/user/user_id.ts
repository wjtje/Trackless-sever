// Import the server and db con from index
import { server, DBcon } from '../index';

// Import string and scripts we need
import { apiCheck, handleQuery, responseDone } from '../scripts';

// Import other modules
import * as _ from 'lodash';

// Get a user
server.get('/user/:user_id', (req, res) => {
  apiCheck(req, res, () => {
    // Get all the infomation from the database
    DBcon.query(
      "SELECT `user_id`, `firstname`, `lastname`, `username`, `group_id`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`group_id`) WHERE `user_id`=?",
      [req.params.user_id],
      handleQuery(res, `Couldn't find the user '${req.params.user_id}'`, (result) => {
        // Send the data to the user
        responseDone(res, {
          result: result
        })
      })
    );
  });
});

// Delete a user from the system
server.delete('/user/:user_id', (req, res) => {
  apiCheck(req, res, () => {
    // Send the command to the database
    DBcon.query(
      "DELETE FROM `TL_users` WHERE `user_id`=?",
      [Number(req.params.user_id)],
      handleQuery(res, `Couldn't delete the user '${req.params.user_id}'`, () => {
        // Delete all apikeys
        DBcon.query(
          "DELETE FROM `TL_apikeys` WHERE `user_id`=?",
          [req.params.user_id]
        );

        // Done
        responseDone(res);
      })
    );
  });
});