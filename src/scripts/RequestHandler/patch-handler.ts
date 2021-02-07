// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {bodyOnlyContains} from '../data-check'
import {DBcon} from '../..'
import {requireObject} from './interface'
import {MysqlError, PoolConnection} from 'mysql'
import ServerError from '../../classes/server-error'

interface commitFunction {
	/**
	 * Run this function when the value was saved succesfully
	 */
	resolve: (value?: any) => void;

	/**
	 * Run this function when something gone wrong
	 */
	reject: (value?: any) => void;

	/**
	 * The key of the value that going to be changes
	 */
	key: string;

	/**
	 * The request from the user
	 */
	request: Request;

	/**
	 * A connection to the database
	 */
	connection: PoolConnection;
}

export function patchHandler(editArray: requireObject[], commitFunction: (options: commitFunction) => void) {
	return (request: Request, response: Response, next: NextFunction) => {
		// Make sure the array does not contain any wrong thing
		bodyOnlyContains(request.body, editArray).then(() => {
			// Create a connection
			DBcon.getConnection((error, connection) => {
				// Start a transaction
				connection.query('START TRANSACTION')

				// Run all changes
				Promise.all(Object.keys(request.body).map(async (key: string) => {
					return new Promise((resolve, reject) => {
						commitFunction({resolve, reject, key, request, connection})
					})
				})).then(() => {
					// Save the changes
					connection.query('COMMIT')
					connection.release()
					response.status(200).json({
						message: 'saved'
					})
				}).catch(error => {
					connection.query('ROLLBACK')
					connection.release()
					next(error)
				})
			})
		}).catch(() => {
			// Something wrong in the array
			next(new ServerError(
				'Please check the documentation',
				400,
				'trackless.patch.bodyError'
			))
		})
	}
}

export function handlePatchQuery(reject: (value?: any) => void, resolve: (value?: any) => void) {
	return (error: MysqlError | null) => {
		if (error) {
			reject(new ServerError(
				'Something went wrong while trying to save. Are your ID\'s correct',
				500,
				'trackless.patch.saveError'
			))
		} else {
			resolve()
		}
	}
}
