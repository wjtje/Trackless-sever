// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import groupIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/groupIDCheckHandler'
import { handleQuery } from '../../scripts/handle'
import { DBcon } from '../..'

const router = express.Router()

router.get(
  '/:groupID',
  authHandler((request) => {
    if (request.params.groupID === '~') {
      return 'trackless.access.readOwn'
    } else {
      return 'trackless.access.readAll'
    }
  }),
  groupIDCheckHandler(),
  (request, response, next) => {
    DBcon.query(
      'SELECT `accessID`, `access` FROM `TL_access` WHERE `groupID`=?',
      [(request.params.groupID === '~') ? Number(request.user?.groupID) : Number(request.params.groupID)],
      handleQuery(next, (result) => {
        response.status(200).json(result)
      })
    )
  }
)

router.use(unusedRequestTypes())

export default router
