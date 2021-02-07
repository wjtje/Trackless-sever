// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import unusedRequestTypes from '../../scripts/RequestHandler/unused-request-type'
import pjson from '../../../package.json'

const router = expressRouter()

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
