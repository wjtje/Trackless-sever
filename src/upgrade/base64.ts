// Copyright (c) 2020 Wouter van der Wal

import {DBcon} from '..'
import {encodeText} from '../scripts/test-encoding'

interface Work {
	workID: number;
	description: string;
}

interface Api {
	apiID: number;
	deviceName: string;
}

// Upgrade work
console.log('Starting upgrade work')
DBcon.query(
	'SELECT `workID`, `description` FROM `TL_work`',
	(error, result: Work[]) => {
		if (!error) {
			// Convert each row to base64
			result.forEach(element => {
				DBcon.query(
					'UPDATE `TL_work` SET `description` = ? WHERE `TL_work`.`workID` = ?',
					[
						encodeText(element.description),
						element.workID
					],
					error => {
						if (!error) {
							console.log('Upgraded work')
						}
					}
				)
			})
		}
	}
)

// Upgrade apikeys
console.log('Starting upgrade apikeys')
DBcon.query(
	'SELECT `apiID`, `deviceName` FROM `TL_apikeys`',
	(error, result: Api[]) => {
		if (!error) {
			// Convert each row to base64
			result.forEach(element => {
				DBcon.query(
					'UPDATE `TL_apikeys` SET `deviceName` = ? WHERE `TL_apikeys`.`apiID` = ?',
					[
						encodeText(element.deviceName),
						element.apiID
					],
					error => {
						if (!error) {
							console.log('Upgraded apikey')
						}
					}
				)
			})
		}
	}
)
