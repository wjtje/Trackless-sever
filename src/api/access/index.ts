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
      "SELECT `accessId`, `access` FROM `TL_access` WHERE `groupId`=?",
      [request.user?.groupId],
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
    {name: 'groupId', check: mysqlINT},
    {name: 'access', check: mysqlTEXT},
  ]),
  (request, response, next) => {
    DBcon.query(
      "SELECT `groupId` FROM `TL_groups` WHERE `groupId`=?",
      [request.body.groupId],
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
            "INSERT INTO `TL_access` (`groupId`, `access`) VALUES (?,?)",
            [
              request.body.groupId,
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

import accessIdRoute from './accessId';
router.use('/', accessIdRoute);

router.use(unusedRequestTypes());

export default router;
