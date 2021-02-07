// Copyright (c) 2020 Wouter van der Wal

class ServerError extends Error {
	status?: number
	code?: string
	type?: string

	constructor(public message: string) {
		super()
	}
}

export default ServerError
