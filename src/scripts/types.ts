/**
 * tests a value if it is a string
 * 
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
 * @since 0.2-beta.1
 * @param testValue 
 * @returns {boolean}
 */
export const number = (testValue:any) : boolean => {
  return !isNaN(Number(testValue));
}