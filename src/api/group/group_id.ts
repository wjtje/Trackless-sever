import express, { response } from 'express';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';
import authHandler from '../../scripts/RequestHandler/authHandler';
import { DBcon } from '../..';
import { handleQuery } from '../../scripts/handle';
import groupIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/groupIdCheckHandler';
import requireHandler from '../../scripts/RequestHandler/requireHandler';
import { mysqlTEXT } from '../../scripts/types';
import userIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIdCheckHandler';
import { getUsers } from '../query';

const router = express.Router();

// Return a single group
router.get(
  '/:groupId',
  authHandler('trackless.group.readAll'),
  groupIdCheckHandler(),
  (request, response, next) => {
    // Group_id is valid return the info
    DBcon.query(
      "SELECT * FROM `TL_groups` WHERE `group_id`=?",
      [request.params.groupId],
      handleQuery(next, (resultGroup) => {
        // Get all users
        DBcon.query(
          getUsers,
          [request.params.groupId],
          handleQuery(next, (resultUsers) => {
            // Return the infomation
            response.status(200).json([{
              group_id: request.params.groupId, 
              groupName: resultGroup[0].groupName,
              users: resultUsers,
            }])
          })
        );
      })
    )
  }
);

// Remove a single group
router.delete(
  '/:groupId',
  authHandler('trackless.group.remove'),
  groupIdCheckHandler(),
  (request, response, next) => {
    // Group_id is valid remove it
    DBcon.query(
      "DELETE FROM `TL_groups` WHERE `group_id`=?",
      [request.params.groupId],
      handleQuery(next, () => {
        // Remove all the users from that group
        DBcon.query(
          "UPDATE `TL_users` SET `group_id`=0 WHERE `group_id`=?",
          [request.params.groupId]
        );

        response.status(200).json({
          message: 'Removed'
        });
      })
    );
  }
);

// Edits a group name
router.patch(
  '/:groupId',
  authHandler('trackless.group.edit'),
  requireHandler([
    {name: 'groupName', check: mysqlTEXT}
  ]),
  groupIdCheckHandler(),
  (request, response, next) => {
    // Group_id is valid edit it
    DBcon.query(
      "UPDATE `TL_groups` SET `groupName`=? WHERE `group_id`=?",
      [
        request.body.groupName,
        request.params.groupId
      ],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'Updated'
        });
      })
    );
  }
);

// Add a user to a group
router.post(
  '/:groupId/add/:userId',
  authHandler('trackless.group.add'),
  groupIdCheckHandler(),
  userIdCheckHandler(),
  (request, response, next) => {
    // Change it in the database
    DBcon.query(
      "UPDATE `TL_users` SET `group_id`=? WHERE `user_id`=?",
      [
        request.params.groupId,
        request.params.userId
      ],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'Updated'
        });
      })
    );
  }
)

router.use(unusedRequestTypes());

export default router;