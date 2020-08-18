// Copyright (c) 2020 Wouter van der Wal

import express from 'express';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';
import authHandler from '../../scripts/RequestHandler/authHandler';
import requireHandler from '../../scripts/RequestHandler/requireHandler';
import { mysqlINT, mysqlDATE, mysqlTEXT } from '../../scripts/types';
import { DBcon } from '../..';
import { handleQuery } from '../../scripts/handle';
import ServerError from '../../scripts/RequestHandler/serverErrorInterface';

const router = express.Router();

router.post(
  '/',
  authHandler('trackless.work.create'),
  requireHandler([
    {name: 'locationId', check: mysqlINT},
    {name: 'time', check: mysqlINT},
    {name: 'date', check: mysqlDATE},
    {name: 'description', check: mysqlTEXT},
  ]),
  (request, response, next) => {
    // Check if the locationId is valid
    DBcon.query(
      "SELECT `locationId` FROM `TL_locations` WHERE `locationId`=?",
      [request.body.locationId],
      handleQuery(next, (result) => {
        if (result.length === 0) {
          // LocationId is wrong
          const error: ServerError = new Error('Your locationId is not valid');
          error.status = 400;
          error.code = 'trackless.work.notValidLocationId';
          next(error)
        } else {
          // locationId is valid 
          // Push the new work to the server
          DBcon.query(
            "INSERT INTO `TL_work` (`userId`, `locationId`, `time`, `date`, `description`) VALUES (?,?,?,?,?)",
            [
              request.user?.userId,
              request.body.locationId,
              request.body.time,
              request.body.date,
              request.body.description,
            ],
            handleQuery(next, (result) => {
              // Response with the new id
              response.status(201).json({
                workId: result.insertId
              });
            })
          );
        }
      })
    )
  }
)

import userRoute from './user';
router.use('/user', userRoute);

router.use(unusedRequestTypes());

export default router;
