// Copyright (c) 2020 Wouter van der Wal

import {Request, Response, NextFunction} from 'express'
import {logger} from '../..'
import ServerError from './server-error-interface'

const serverErrorHandler = () => {
	return (error: ServerError, request: Request, response: Response, next: NextFunction) => {
		// Log the error using winston
		logger.log('info', 'Express error', error)

		response.status(error.status ?? 500).json({
			message: error.message,
			code: error.code ?? error.type ?? 'trackless.unknownError'
		})

		next()
	}
}

export default serverErrorHandler
