// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/authHandler'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIDCheckHandler'

const router = express.Router()

// List all access rules for a user
router.get(
  '/:userID/access',
  authHandler(request => (request.params.userID === '~') ? 'trackless.access.readOwn' : 'trackless.access.readAll'),
  userIDCheckHandler(),
  (request, response, next) => {
    DBcon.query(
      'SELECT `access`, `accessID` FROM `TL_access` a INNER JOIN `TL_users` u ON a.groupID = u.groupID WHERE u.userID = ?',
      [(request.params.userID === '~') ? request.user?.userID : request.params.userID],
      handleQuery(next, (result) => {
        response.status(200).json(result)
      })
    )
  }
)

export default router
