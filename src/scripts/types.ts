// Copyright (c) 2020 Wouter van der Wal

import moment from 'moment'

/**
 * Tests a value if it is a mysql INT
 *
 * @since 0.3-beta.4
 * @param testValue
 * @returns {boolean}
 */
export const mysqlINT = (testValue: any): boolean => {
	// Check if the value is not NaN
	if (Number.isNaN(Number(testValue))) {
		return false // It is not a INT
	}

	if (Number(testValue) > 2147483647 || Number(testValue) < -2147483648) { // Check if the value is not to big or to small
		return false // It is not a INT
	}

	if (Number(testValue).toString().split('.').length > 1) { // Check if it is a INT
		return false // It is a float
	}

	return true
}

/**
 * Tests a value if it is a mysql FLOAT
 *
 * @since 0.3-beta.4
 * @param testValue
 * @returns {boolean}
 */
export const mysqlFLOAT = (testValue: any): boolean => {
	// Check if the value is not NaN
	if (Number.isNaN(Number(testValue))) {
		return false // It is not a FLOAT
	}

	const float = Number(testValue).toString().split('.')

	if (float[0] === null || float[0] === undefined) {
		return false
	}

	if (float[1] === null || float[1] === undefined) {
		// Only one var
		if (float[0].length > 2) {
			return false // To large
		}

		return true
	}

	if (float[0].length > 2 || float[1].length > 2) {
		return false // To large
	}

	if ((float[0] + float[1]).length > 4) {
		return false
	}

	return true
}

/**
 * Tests a value if it is a mysql DATE
 *
 * @since 0.3-beta.4
 * @param testValue
 * @returns {boolean}
 */
export const mysqlDATE = (testValue: any): boolean => {
	return moment(testValue, 'YYYY-MM-DD').isValid()
}

/**
 * Tests a value if it is a mysql TEXT with full utf8 support
 *
 * @since 0.4-beta.5
 * @param testValue
 * @returns {boolean}
 */
export const mysqlUTFTEXT = (testValue: any): boolean => {
	const testValueString = String(testValue) // Make sure it is a string

	if (testValueString.length > 65535 || typeof testValue !== 'string' || testValueString === '') {
		return false // The string is to large
	}

	return true
}

/**
 * Tests a value if it is a mysql TEXT
 *
 * @since 0.3-beta.4
 * @param testValue
 * @returns {boolean}
 */
export const mysqlTEXT = (testValue: any): boolean => {
	const testValueString = String(testValue) // Make sure it is a string

	if (testValueString.length > 65535 || typeof testValue !== 'string' || testValueString === '') {
		return false // The string is to large
	}

	// Test if string only contains acsii
	return /^[\u0020-\u007E]*$/.test(testValue)
}

/**
 * Tests a value if it is a mysql LONGTEXT
 *
 * @since 0.3-beta.4
 * @param testValue
 * @returns {boolean}
 */
export const mysqlLONGTEXT = (testValue: any): boolean => {
	const testValueString = String(testValue) // Make sure it is a string

	if (testValueString.length > 4294967296 || typeof testValue !== 'string' || testValueString === '') {
		return false // The string is to large
	}

	// Test if string only contains acsii
	return /^[\u0020-\u007E]*$/.test(testValue)
}

/**
 * Tests a value if it is a mysql BOOLEAN
 *
 * @since 0.4-beta.2
 * @param testValue
 * @returns {boolean}
 */
export const mysqlBOOLEAN = (testValue: any): boolean => {
	if (Number(testValue) === 0 || Number(testValue) === 1) {
		return true
	}

	return false
}

/**
 * Test is a value is a correct mysql VARCHAR
 * @since 0.4-beta.5
 * @param length The length of the varchar
 * @returns {(testvalue: any) => boolean} A test function
 */
export const mysqlVARCHAR = (length: number): ((testValue: any) => boolean) => {
	return testValue => {
		const testValueString = String(testValue) // Make sure it is a string

		return !(testValueString.length > length || typeof testValue !== 'string' || testValueString === '')
	}
}
