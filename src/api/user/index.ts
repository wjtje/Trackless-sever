import express from 'express';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';
import authHandler from '../../scripts/RequestHandler/authHandler';
import { DBcon } from '../..';
import { handleQuery } from '../../scripts/handle';
import { getAllUsers } from '../query';
import ServerError from '../../scripts/RequestHandler/serverErrorInterface';
import { storePassword } from '../../scripts/security';
import requireHandler from '../../scripts/RequestHandler/requireHandler';
import { mysqlTEXT, mysqlINT } from '../../scripts/types';

const router = express.Router();

// Get all the users from the system
router.get(
  '/',
  authHandler('trackless.user.readAll'),
  (request, response, next) => {
    // Send the request
    DBcon.query(
      getAllUsers,
      handleQuery(next, (result) => {
        response.status(200).json(result);
      })
    )
  }
);

// Create a new user
router.post(
  '/',
  authHandler('trackless.user.create'),
  requireHandler([
    {name: "firstname", check: mysqlTEXT},
    {name: "lastname", check: mysqlTEXT},
    {name: "username", check: mysqlTEXT},
    {name: "password", check: mysqlTEXT},
    {name: "groupId", check: mysqlINT}
  ]),
  (request, response, next) => {
    // Check if the user is taken
    DBcon.query(
      "SELECT `username` FROM `TL_users` WHERE `username`=?",
      [ request.body.username ],
      handleQuery(next, (result) => {
        if (result.length > 0) {
          // Username is taken
          const error: ServerError = new Error('Username has been taken');
          error.status = 400;
          error.code = 'trackless.user.usernameTaken';
          next(error);
        } else {
          // Create a new user
          // Store the password
          const [salt, hash] = storePassword(request.body.password);

          // Commit to the database
          DBcon.query(
            "INSERT INTO `TL_users` ( `firstname`, `lastname`, `username`, `group_id`, `salt_hash`, `hash` ) VALUES ( ?, ?, ?, ?, ?, ?)",
            [
              request.body.firstname,
              request.body.lastname,
              request.body.username,
              Number(request.body.groupId),
              salt,
              hash
            ],
            handleQuery(next, (result) => {
              response.status(201).json({
                userId: result.insertId
              });
            })
          );
        }
      })
    );
  }
);

import userIdRouter from './user_id';
router.use(userIdRouter);

router.use(unusedRequestTypes());

export default router;