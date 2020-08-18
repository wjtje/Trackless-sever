// Copyright (c) 2020 Wouter van der Wal

import { version } from '../../global/about';
import express from 'express';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';

const router = express.Router();

router.get(
  '/',
  (request, response, next) => {
    response.status(200).json({
      version: version
    });
  }
);

router.use(unusedRequestTypes());

export default router;
