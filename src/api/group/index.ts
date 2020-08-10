import express from 'express';
import authHandler from '../../scripts/RequestHandler/authHandler';
import { DBcon } from '../..';
import { handleQuery } from '../../scripts/handle';
import { TL_groups } from './interface';
import { promisify } from 'util';
import requireHandler from '../../scripts/RequestHandler/requireHandler';
import { mysqlTEXT } from '../../scripts/types';
import ServerError from '../../scripts/RequestHandler/serverErrorInterface';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';

const query = promisify(DBcon.query).bind(DBcon);
const router = express.Router();

// Return all the groups
router.get(
  '/',
  authHandler('trackless.group.readAll'),
  (request, response, next) => {
    // List all group
    DBcon.query(
      "SELECT * FROM `TL_groups` ORDER BY `groupname`",
      handleQuery(next, (result: Array<TL_groups>) => {
        let rslt = []; // Result

        // Get all users for each group
        async function readUser() {
          await Promise.all(result.map(async (group: {
            group_id: number;
            groupName: string;
          }) => {
            // Connect to the database
            const users = await query("SELECT `user_id`, `firstname`, `lastname`, `username` FROM `TL_users` WHERE `group_id`=? ORDER BY `firstname`,`lastname`", [group.group_id]);

            // Append to the rslt list
            rslt.push({
              group_id: group.group_id,
              groupName: group.groupName,
              users: users
            });
          }));

          // Return to the user
          response.status(200).json(rslt);
        }

        readUser(); // Start the async function
      })
    );
  }
);

// Create a new group
router.post(
  '/',
  authHandler('trackless.group.create'),
  requireHandler([
    { name: 'groupName', check: mysqlTEXT },
  ]),
  (request, response, next) => {
    // Create a query
    DBcon.query(
      "INSERT INTO `TL_groups` (`groupName`) VALUES (?)",
      [request.body.groupName],
      handleQuery(next, (result) => {
        // Saved into the database
        response.status(201).json({
          group_id: result.insertId
        })
      })
    )
  }
);

router.use(unusedRequestTypes());

export default router;
