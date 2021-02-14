/**
 * Test if the testValue is a valid mysqlTEXT that only contains ACSII
 *
 * @param testValue The value to test
 */
const mysqlTEXT: TestFunction = testValue => {
	// Create a string for testing the length
	const testValueString = String(testValue)

	// Test the length
	// Test the type
	// Test if it's not empty
	if (
		testValueString.length > 65535 ||
		typeof testValue !== 'string' ||
		testValueString === ''
	) {
		return false
	}

	// Make sure it only contains vallid ACSII
	return /^[\u0020-\u007E]*$/.test(testValue)
}

export default mysqlTEXT
