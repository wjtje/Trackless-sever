// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import {DBcon, logger} from '../..'
import {handleQuery} from '../../scripts/handle'
import {TLgroups} from './interface'
import requireHandler from '../../scripts/RequestHandler/require-handler'
import {mysqlTEXT} from '../../scripts/types'
import unusedRequestTypes from '../../scripts/RequestHandler/unused-request-type'
import groupIDRoute from './group-id'
import sortHandler from '../../scripts/RequestHandler/sort-handler'
import userRoute from './user'
import accessRoute from './access'
import settingRoute from './setting'
import limitOffsetHandler from '../../scripts/RequestHandler/limit-offset-handler'
import {getDatabaseConnection} from '../../handlers/database-connection'

const router = expressRouter()

// Return all the groups
router.get(
	'/',
	getDatabaseConnection(),
	authHandler('trackless.group.read'),
	sortHandler([
		'groupID',
		'groupName'
	]),
	limitOffsetHandler(),
	(request, response, next) => {
		// List all group
		DBcon.query(
			`SELECT * FROM \`TL_groups\` ${request.querySort ?? 'ORDER BY `groupname`'} ${request.queryLimitOffset ?? ''}`,
			handleQuery(next, (result: TLgroups[]) => {
				const rslt: Array<{
					groupID: number;
					groupName: string;
					users: Record<string, unknown>;
				}> = [] // Result

				// Get all users for each group
				Promise.all(result.map(async group => {
					return new Promise(resolve => {
						DBcon.query(
							'SELECT `userID`, `firstname`, `lastname`, `username`, `groupID`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`groupID`) WHERE `groupID`=? ORDER BY `firstname`, `lastname`, `username`',
							[group.groupID],
							handleQuery(next, result => {
								// Push the result to the response array
								rslt.push({
									groupID: group.groupID,
									groupName: group.groupName,
									users: result
								})

								resolve(null)
							})
						)
					})
				}))
					.then(() => {
						// Done return to the user
						response.status(200).json(rslt)
					})
					.catch(() => {
						// Something went wrong
						response.status(500).json({
							message: 'You broke the system'
						})
					})
			})
		)
	}
)

// Create a new group
router.post(
	'/',
	getDatabaseConnection(),
	authHandler('trackless.group.create'),
	requireHandler([
		{name: 'groupName', check: mysqlTEXT}
	]),
	(request, response, next) => {
		// Create a query
		DBcon.query(
			'INSERT INTO `TL_groups` (`groupName`) VALUES (?)',
			[request.body.groupName],
			handleQuery(next, result => {
				// Saved into the database
				response.status(201).json({
					groupID: result.insertId
				})
			})
		)
	}
)

// Import other group routes
router.use('/', groupIDRoute)
router.use('/', userRoute)
router.use('/', accessRoute)
router.use(settingRoute)

router.use(unusedRequestTypes())

export default router
