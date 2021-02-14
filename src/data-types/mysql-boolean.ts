/**
 * Tests if the value is a valid mysql boolean
 *
 * @param testValue The value to test
 */
const mysqlBOOLEAN: TestFunction = testValue => {
	if (Number(testValue) === 0 || Number(testValue) === 1) {
		return true
	}

	return false
}

export default mysqlBOOLEAN
