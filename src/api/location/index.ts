// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType'
import authHandler from '../../scripts/RequestHandler/authHandler'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import requireHandler from '../../scripts/RequestHandler/requireHandler'
import { mysqlTEXT } from '../../scripts/types'
import userRoute from './user'
import locationIdRoute from './locationId'
import sortHandler from '../../scripts/RequestHandler/sortHandler'

const router = express.Router()

router.get(
  '/',
  authHandler('trackless.location.read'),
  sortHandler([
    'locationId',
    'name',
    'place',
    'id',
    'hidden'
  ]),
  (request, response, next) => {
    DBcon.query(
      `SELECT * FROM \`TL_locations\` WHERE \`locationId\`!=0 ${(request.query.hidden == null) ? 'AND `hidden`=0' : ''} ${String(response.locals.sort || 'ORDER BY `place`, `name`')}`,
      handleQuery(next, (result) => {
        response.status(200).json(result)
      })
    )
  }
)

router.post(
  '/',
  authHandler('trackless.location.create'),
  requireHandler([
    { name: 'name', check: mysqlTEXT },
    { name: 'place', check: mysqlTEXT },
    { name: 'id', check: mysqlTEXT }
  ]),
  (request, response, next) => {
    // Push to the server
    DBcon.query(
      'INSERT INTO `TL_locations` (`name`, `place`, `id`) VALUES (?, ?, ?)',
      [
        request.body.name,
        request.body.place,
        request.body.id
      ],
      handleQuery(next, (result) => {
        // Saved to the database
        response.status(201).json({
          locationId: result.insertId
        })
      })
    )
  }
)

router.use('/user', userRoute)

router.use('/', locationIdRoute)

router.use(unusedRequestTypes())

export default router
