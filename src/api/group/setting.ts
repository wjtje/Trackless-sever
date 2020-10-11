// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/authHandler'
import groupIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/groupIDCheckHandler'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import { mysqlTEXT } from '../../scripts/types'

const router = express.Router()

// Get all settings for a single group
router.get(
  '/:groupID/setting',
  authHandler('trackless.setting.readAll'),
  groupIDCheckHandler(),
  (request, response, next) => {
    DBcon.query(
      'SELECT settingID, setting, value, groupID, groupName FROM TL_settings join TL_groups USING(groupID) where groupID=?',
      [request.params.groupID],
      handleQuery(next, (result) => {
        response.json(result)
      })
    )
  }
)

// Create a new setting for a single group
router.post(
  '/:groupID/setting',
  authHandler('trackless.setting.create'),
  groupIDCheckHandler(),
  requireHandler([
    { name: 'setting', check: mysqlTEXT },
    { name: 'value', check: mysqlTEXT }
  ]),
  (request, response, next) => {
    DBcon.query(
      'INSERT INTO `TL_settings`(`groupID`, `setting`, `value`) VALUES (?, ?, ?)',
      [request.params.groupID, request.body.setting, request.body.value],
      handleQuery(next, (result) => {
        response.json({
          settingsID: result.insertId
        })
      })
    )
  }
)

export default router
