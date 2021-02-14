interface requireObject {
	/**
	 * The name of the required value
	 */
	name: string;
	/**
	 * A function to test the value against
	 */
	check: TestFunction;
}
