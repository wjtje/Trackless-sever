// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import pjson from '../../../package.json'

const router = express.Router()

router.get(
  '/',
  (request, response) => {
    response.status(200).json({
      version: pjson.version
    })
  }
)

router.use(unusedRequestTypes())

export default router
