import express from 'express';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';
import authHandler from '../../scripts/RequestHandler/authHandler';
import { DBcon } from '../..';
import { handleQuery } from '../../scripts/handle';
import requireHandler from '../../scripts/RequestHandler/requireHandler';
import ServerError from '../../scripts/RequestHandler/serverErrorInterface';
import { mysqlINT, mysqlTEXT } from '../../scripts/types';

const router = express.Router();

// Get your access
router.get(
  '/',
  authHandler('trackless.access.read'),
  (request, response, next) => {
    // Get all the data from the server
    DBcon.query(
      "SELECT `access_id`, `access` FROM `TL_access` WHERE `group_id`=?",
      [request.user?.group_id],
      handleQuery(next, (result) => {
        response.status(200).json(result);
      })
    )
  }
);

// Give someone access
router.post(
  '/',
  authHandler('trackless.access.create'),
  requireHandler([
    {name: 'group_id', check: mysqlINT},
    {name: 'access', check: mysqlTEXT},
  ]),
  (request, response, next) => {
    DBcon.query(
      "SELECT `group_id` FROM `TL_groups` WHERE `group_id`=?",
      [request.body.group_id],
      handleQuery(next, (result) => {
        if (result.length === 0) {
          // Group not found
          const error: ServerError = new Error("The group is not found");
          error.code = 'trackless.access.groupNotFound';
          error.status = 400;
          next(error);
        } else {
          // Save it to the database
          DBcon.query(
            "INSERT INTO `TL_access` (`group_id`, `access`) VALUES (?,?)",
            [
              request.body.group_id,
              request.body.access,
            ],
            handleQuery(next, (result) => {
              response.status(201).json({
                accessId: result.insertId
              });
            })
          )
        }
      })
    )
  }
)

import groupRouter from './group';
router.use('/group', groupRouter);

import accessIdRoute from './access_id';
router.use('/', accessIdRoute);

router.use(unusedRequestTypes());

export default router;
