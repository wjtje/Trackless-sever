// Copyright (c) 2020 Wouter van der Wal

import express from 'express';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';
import authHandler from '../../scripts/RequestHandler/authHandler';
import { DBcon } from '../..';
import { handleQuery } from '../../scripts/handle';

const router = express.Router();

// Get all your active api keys
router.get(
  '/',
  authHandler('trackless.api.read'),
  (request, response, next) => {
    // Get all the api keys from the server
    DBcon.query(
      "SELECT `apiId`, `createDate`, `lastUsed`, `deviceName` FROM `TL_apikeys` WHERE `userId`=?",
      [request.user?.userId],
      handleQuery(next, (result) => {
        // Send the data back to the user
        response.status(200).json(result);
      })
    )
  }
);

import apiIdRoute from './apiId';
router.use('/', apiIdRoute);

router.use(unusedRequestTypes());

export default router;