// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/authHandler'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIDCheckHandler'

const router = express.Router()

// Get all settings for a single user
router.get(
  '/:userID/setting',
  authHandler((request) => (request.params.userID === '~') ? 'trackless.setting.readOwn' : 'trackless.setting.readAll'),
  userIDCheckHandler(),
  (request, response, next) => {
    DBcon.query(
      'SELECT settingID, setting, value, groupID, groupName FROM TL_settings join TL_groups USING(groupID) join TL_users USING(groupID) where userID=?',
      [(request.params.userID === '~') ? request.user?.userID : request.params.userID],
      handleQuery(next, (result) => {
        response.json(result)
      })
    )
  }
)

export default router
