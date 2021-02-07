// Copyright (c) 2020 Wouter van der Wal

import {requireObject} from './RequestHandler/interface'
import _ from 'lodash'
import {Request} from 'express'

/**
 * Checks if there are no bad keys in the first array using the second array
 *
 * @since 0.2-beta.1
 * @param array
 * @param searchList
 */
export async function bodyOnlyContains(body: Request['body'], searchList: requireObject[]) {
	return new Promise((resolve, reject) => {
		let isRejected = false

		Object.keys(body).forEach(item => {
			const index = _.findIndex(searchList, ['name', item])

			if (index === -1) {
				isRejected = true
				reject(new Error('Not found'))
			} else if (!searchList[index].check(_.get(body, item))) {
				isRejected = true
				reject(new Error('Check failed'))
			}
		})

		if (!isRejected) {
			resolve(null)
		}
	})
}
