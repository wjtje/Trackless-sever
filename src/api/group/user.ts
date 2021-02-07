// Copyright (c) 2020 Wouter van der Wal

import {Router as expressRouter} from 'express'
import {DBcon} from '../..'
import {closeDatabaseConnection, getDatabaseConnection} from '../../handlers/database-connection'
import {handleQuery} from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/auth-handler'
import groupIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/group-id-check-handler'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/user-id-check-handler'
import limitOffsetHandler from '../../scripts/RequestHandler/limit-offset-handler'
import requireHandler from '../../scripts/RequestHandler/require-handler'
import sortHandler from '../../scripts/RequestHandler/sort-handler'
import {mysqlINT} from '../../scripts/types'

const router = expressRouter()

// Get all the users in a group
router.get(
	'/:groupID/user',
	getDatabaseConnection(),
	authHandler('trackless.group.read'),
	groupIDCheckHandler(),
	sortHandler([
		'userID',
		'firstname',
		'lastname',
		'username',
		'groupID',
		'groupName'
	]),
	limitOffsetHandler(),
	(request, response, next) => {
		// Get all the infomation we need
		DBcon.query(
			`SELECT \`userID\`, \`firstname\`, \`lastname\`, \`username\`, \`groupID\`, \`groupName\` FROM \`TL_users\` INNER JOIN \`TL_groups\` USING (\`groupID\`) WHERE \`groupID\`=? ${request.querySort ?? 'ORDER BY `firstname`, `lastname`, `username`'} ${request.queryLimitOffset ?? ''}`,
			[request.params.groupID],
			handleQuery(next, result => {
				// Return the infomation
				response.status(200).json(result)
			})
		)
	}
)

// Add a user to a group
router.post(
	'/:groupID/user',
	getDatabaseConnection(),
	authHandler('trackless.group.add'),
	groupIDCheckHandler(),
	requireHandler([
		{name: 'userID', check: mysqlINT}
	]),
	userIDCheckHandler(request => request.body.userID),
	(request, response, next) => {
		// Change it in the database
		DBcon.query(
			'UPDATE `TL_users` SET `groupID`=? WHERE `userID`=?',
			[
				request.params.groupID,
				request.body.userID
			],
			handleQuery(next, () => {
				response.status(201).json({
					message: 'Updated'
				})
			})
		)
	}
)

export default router
