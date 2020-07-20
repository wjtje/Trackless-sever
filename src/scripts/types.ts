import moment from "moment";

/**
 * tests a value if it is a string
 * 
 * @deprecated
 * @since 0.2-beta.1
 * @param testValue 
 * @returns {boolean}
 */
export const string = (testValue:any) : boolean => {
  return (typeof testValue === "string")? true:false
};

/**
 * tests a value if it is a number
 * 
 * @deprecated
 * @since 0.2-beta.1
 * @param testValue 
 * @returns {boolean}
 */
export const number = (testValue:any) : boolean => {
  return !isNaN(Number(testValue));
}

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
    return false; // It is not a INT
  } else if (Number(testValue) > 2147483647) {  // Check if the value is not to big
    return false; // It is not a INT
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
    return false; // It is not a FLOAT
  } else {  // TODO: Test if the value is to large
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
  return moment(testValue, "YYYY-MM-DD").isValid();
}

/**
 * Tests a value if it is a mysql TEXT
 * 
 * @since 0.3-beta.4
 * @param testValue 
 * @returns {boolean}
 */
export const mysqlTEXT = (testValue:any) : boolean => {
  testValue = String(testValue);  // Make sure it is a string

  if (new Blob([testValue]).size > 65535) {
    return false; // The string is to large
  } else {
    return true;
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
  testValue = String(testValue);  // Make sure it is a string

  if (new Blob([testValue]).size > 4294967296) {
    return false; // The string is to large
  } else {
    return true;
  }
}