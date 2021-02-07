// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import moment from 'moment'
import {DBcon} from '../..'
import ServerError from '../../classes/server-error'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'
import {handleQuery} from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/user-id-check-handler'
import limitOffsetHandler from '../../scripts/RequestHandler/limit-offset-handler'
import requireHandler from '../../scripts/RequestHandler/require-handler'
import settingsHandler from '../../scripts/RequestHandler/settings-handler'
import sortHandler from '../../scripts/RequestHandler/sort-handler'
import {responseWork, TLWork} from '../../scripts/response-work'
import {encodeText} from '../../scripts/test-encoding'
import {mysqlINT, mysqlDATE, mysqlFLOAT, mysqlUTFTEXT} from '../../scripts/types'

const router = expressRouter()

router.get(
	'/:userID/work',
	getDatabaseConnection(),
	authHandler(request => (request.params.userID === '~') ? 'trackless.work.readOwn' : 'trackless.work.readAll'),
	userIDCheckHandler(),
	sortHandler([
		'workID',
		'time',
		'date',
		'description',
		'user.userID',
		'user.firstname',
		'user.lastname',
		'user.username',
		'user.groupID',
		'user.groupName',
		'location.locationID',
		'location.place',
		'location.name',
		'location.id',
		'worktype.worktypeID',
		'worktype.name'
	]),
	limitOffsetHandler(),
	(request, response, next) => {
		// Check if the startDate and / or endDate is correct
		let sort = ''

		if (moment(String(request.query.startDate), 'YYYY-MM-DD').isValid()) {
			sort += ` AND \`date\` >= '${moment(String(request.query.startDate), 'YYYY-MM-DD').format('YYYY-MM-DD')}' `
		}

		if (moment(String(request.query.endDate), 'YYYY-MM-DD').isValid()) {
			sort += ` AND \`date\` <= '${moment(String(request.query.endDate), 'YYYY-MM-DD').format('YYYY-MM-DD')}' `
		}

		// Get all the work for that user
		DBcon.query(
			`SELECT * FROM \`TL_vWork\` WHERE \`user.userID\`=? ${sort} ${request.querySort ?? ' ORDER BY `date`'} ${request.queryLimitOffset ?? ''}`,
			[(request.params.userID === '~') ? request.user?.userID : request.params.userID],
			handleQuery(next, (result: TLWork[]) => {
				responseWork(result, response)
			})
		)
	}
)

router.post(
	'/:userID/work',
	getDatabaseConnection(),
	authHandler(request => (request.params.userID === '~') ? 'trackless.work.createOwn' : 'trackless.work.createAll'),
	userIDCheckHandler(),
	requireHandler([
		{name: 'locationID', check: mysqlINT},
		{name: 'worktypeID', check: mysqlINT},
		{name: 'time', check: mysqlFLOAT},
		{name: 'date', check: mysqlDATE},
		{name: 'description', check: mysqlUTFTEXT}
	]),
	settingsHandler(),
	(request, response, next) => {
		const saveWork = () => {
			// Push the new work to the server
			DBcon.query(
				'INSERT INTO `TL_work` (`userID`, `locationID`, `worktypeID`, `time`, `date`, `description`) VALUES (?,?,?,?,?,?)',
				[
					(request.params.userID === '~') ? request.user?.userID : request.params.userID,
					request.body.locationID,
					request.body.worktypeID,
					request.body.time,
					request.body.date,
					encodeText(request.body.description)
				],
				handleQuery(next, result => {
					// Response with the new id
					response.status(201).json({
						workID: result.insertId
					})
				})
			)
		}

		// Check if the user is allowed to add work
		if (response.locals.setting?.workLateDays === null || response.locals.setting?.workLateDays === undefined) {
			saveWork()
		} else if (moment(request.body.date).isAfter(moment().subtract(Number(response.locals.setting.workLateDays), 'days'))) {
			saveWork()
		} else {
			next(new ServerError(
				'You are not allowed to save work',
				400,
				'trackless.work.toLate'
			))
		}
	}
)

export default router
