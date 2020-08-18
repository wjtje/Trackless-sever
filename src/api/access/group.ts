// Copyright (c) 2020 Wouter van der Wal

import express from 'express';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';
import authHandler from '../../scripts/RequestHandler/authHandler';
import groupIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/groupIdCheckHandler';
import { handleQuery } from '../../scripts/handle';
import { DBcon } from '../..';

const router = express.Router();

router.get(
  '/:groupId',
  authHandler('trackless.access.readAll'),
  groupIdCheckHandler(),
  (request, response, next) => {
    DBcon.query(
      "SELECT `accessId`, `access` FROM `TL_access` WHERE `groupId`=?",
      [request.params.groupId],
      handleQuery(next, (result) => {
        response.status(200).json(result);
      })
    );
  }
);

router.use(unusedRequestTypes());

export default router;
