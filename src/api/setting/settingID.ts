// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/authHandler'
import settingIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/settingIDCheckHandler'
import { handlePatchQuery, patchHandler } from '../../scripts/RequestHandler/patchHandler'
import { mysqlINT, mysqlTEXT } from '../../scripts/types'

const router = express.Router()

// Get infomation about a single setting
router.get(
  '/:settingID',
  authHandler('trackless.setting.readAll'),
  settingIDCheckHandler(),
  (request, response, next) => {
    DBcon.query(
      'SELECT settingID, setting, value, groupID, groupName FROM TL_settings join TL_groups USING(groupID) where settingID=?',
      [request.params.settingID],
      handleQuery(next, (result) => {
        response.json(result)
      })
    )
  }
)

// Remove a single setting
router.delete(
  '/:settingID',
  authHandler('trackless.setting.remove'),
  settingIDCheckHandler(),
  (request, response, next) => {
    DBcon.query(
      'DELETE FROM `TL_settings` WHERE `settingID`=?',
      [request.params.settingID],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'success'
        })
      })
    )
  }
)

// Edit a setting
router.patch(
  '/:settingID',
  authHandler('trackless.setting.edit'),
  patchHandler(
    [
      { name: 'groupID', check: mysqlINT },
      { name: 'setting', check: mysqlTEXT },
      { name: 'value', check: mysqlTEXT }
    ],
    (resolve, reject, key, request, connection) => {
      connection.query(
        'UPDATE `TL_settings` SET `' + key + '`=? WHERE `settingID`=?',
        [
          request.body[key],
          request.params.settingID
        ],
        handlePatchQuery(reject, resolve)
      )
    }
  )
)

export default router
