// Copyright (c) 2020 Wouter van der Wal

import moment from 'moment'

/**
 * Tests a value if it is a mysql INT
 *
 * @since 0.3-beta.4
 * @param testValue
 * @returns {boolean}
 */
export const mysqlINT = (testValue:any) : boolean => {
  // Check if the value is not NaN
  if (isNaN(Number(testValue))) {
    return false // It is not a INT
  } else if (Number(testValue) > 2147483647 || Number(testValue) < -2147483648) { // Check if the value is not to big or to small
    return false // It is not a INT
  } else {
    return true
  }
}

/**
 * Tests a value if it is a mysql FLOAT
 *
 * @since 0.3-beta.4
 * @param testValue
 * @returns {boolean}
 */
export const mysqlFLOAT = (testValue:any) : boolean => {
  // Check if the value is not NaN
  if (isNaN(Number(testValue))) {
    return false // It is not a FLOAT
  } else { // TODO: Test if the value is to large
    return true
  }
}

/**
 * Tests a value if it is a mysql DATE
 *
 * @since 0.3-beta.4
 * @param testValue
 * @returns {boolean}
 */
export const mysqlDATE = (testValue:any) : boolean => {
  return moment(testValue, 'YYYY-MM-DD').isValid()
}

/**
 * Tests a value if it is a mysql TEXT
 *
 * @since 0.3-beta.4
 * @param testValue
 * @returns {boolean}
 */
export const mysqlTEXT = (testValue:any) : boolean => {
  const testValueString = String(testValue) // Make sure it is a string

  if (Buffer.from([testValueString]).length > 65535 || typeof testValue !== 'string') {
    return false // The string is to large
  } else {
    return true
  }
}

/**
 * Tests a value if it is a mysql LONGTEXT
 *
 * @since 0.3-beta.4
 * @param testValue
 * @returns {boolean}
 */
export const mysqlLONGTEXT = (testValue:any) : boolean => {
  const testValueString = String(testValue) // Make sure it is a string

  if (Buffer.from([testValueString]).length > 4294967296 || typeof testValue !== 'string') {
    return false // The string is to large
  } else {
    return true
  }
}
