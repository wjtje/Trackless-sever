// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/authHandler'
import limitOffsetHandler from '../../scripts/RequestHandler/limitOffsetHandler'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import sortHandler from '../../scripts/RequestHandler/sortHandler'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import { mysqlINT, mysqlTEXT, mysqlVARCHAR } from '../../scripts/types'
import settingIDhandler from './settingID'

const router = express.Router()

router.get(
  '/',
  authHandler('trackless.setting.readAll'),
  sortHandler([
    'settingID',
    'setting',
    'value',
    'groupID',
    'groupName'
  ]),
  limitOffsetHandler(),
  (request, response, next) => {
    DBcon.query(
      'SELECT `settingID`, `setting`, `value`, `groupID`, `groupName` FROM `TL_settings` JOIN `TL_groups` USING(`groupID`) ' + `${request.querySort ?? ''} ${request.queryLimitOffset ?? ''}`,
      handleQuery(next, (result) => {
        response.json(result)
      })
    )
  }
)

router.post(
  '/',
  authHandler('trackless.setting.create'),
  requireHandler([
    { name: 'setting', check: mysqlVARCHAR(64) },
    { name: 'value', check: mysqlTEXT },
    { name: 'groupID', check: mysqlINT }
  ]),
  (request, response, next) => {
    DBcon.query(
      'INSERT INTO `TL_settings`(`groupID`, `setting`, `value`) VALUES (?, ?, ?)',
      [request.body.groupID, request.body.setting, request.body.value],
      handleQuery(next, (result) => {
        response.json({
          settingsID: result.insertId
        })
      })
    )
  }
)

router.use(settingIDhandler)
router.use(unusedRequestTypes())

export default router
