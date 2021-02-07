/**
 * A serverError is an error that will be displayed to the end user
 */
class ServerError extends Error {
	constructor(
		/**
		 * This message will be displayed to the end user
		 */
		public message: string,
		/**
		 * This is the HTTP code that the request will have
		 */
		public status?: number,
		/**
		 * This is an internal code you can use to find the error
		 */
		public code?: string,
		public type?: string
	) {
		super()
	}
}

export default ServerError
