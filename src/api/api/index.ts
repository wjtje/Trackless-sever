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
      "SELECT `api_id`, `createDate`, `lastUsed`, `deviceName` FROM `TL_apikeys` WHERE `user_id`=?",
      [request.user?.user_id],
      handleQuery(next, (result) => {
        // Send the data back to the user
        response.status(200).json(result);
      })
    )
  }
);

import apiIdRoute from './api_id';
router.use('/', apiIdRoute);

router.use(unusedRequestTypes());

export default router;