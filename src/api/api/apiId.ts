// Copyright (c) 2020 Wouter van der Wal

import express, { response } from 'express';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';
import authHandler from '../../scripts/RequestHandler/authHandler';
import apiIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/apiIdCheckHandler';
import { DBcon } from '../..';
import { handleQuery } from '../../scripts/handle';

const router = express.Router();

// Get infomation about a single api key
router.get(
  '/:apiId',
  authHandler('trackless.api.read'),
  apiIdCheckHandler(),
  (request, response, next) => {
    // Get the data from the server
    DBcon.query(
      "SELECT `apiId`, `createDate`, `lastUsed`, `deviceName` FROM `TL_apikeys` WHERE `userId`=? AND `apiId`=?",
      [request.user?.userId, request.params.apiId],
      handleQuery(next, (result) => {
        // Send the data back to the user
        response.status(200).json(result);
      })
    )
  }
)

// Remove a single api key
router.delete(
  '/:apiId',
  authHandler('trackless.api.remove'),
  apiIdCheckHandler(),
  (request, response, next) => {
    // Send the command to the server
    DBcon.query(
      "DELETE FROM `TL_apikeys` WHERE `apiId`=? and `userId`=?",
      [request.params.apiId, request.user?.userId],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'done'
        })
      })
    );
  }
)

router.use(unusedRequestTypes());

export default router;