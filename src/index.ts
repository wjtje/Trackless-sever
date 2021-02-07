// Copyright (c) 2020 Wouter van der Wal

import {createPool} from 'mysql'
import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import {Strategy as BearerStrategy} from 'passport-http-bearer'
import cors from 'cors'
import {apiLogin} from './scripts/api-login'
import morgan from 'morgan'
import accessRoute from './api/access'
import apiRoute from './api/api'
import groupRoute from './api/group'
import locationRoute from './api/location'
import loginRoute from './api/login'
import userRoute from './api/user'
import workRoute from './api/work'
import severAboutRoute from './api/server/about'
import nocache from 'nocache'
import rateLimit from 'express-rate-limit'
import worktypeRoute from './api/worktype'
import settingRoute from './api/setting'
import docs from '../api/swagger.json'
import fs from 'fs'
import winston from 'winston'
import ServerError from './classes/server-error'
import handleServerError from './handlers/server-error'
import {closeDatabaseConnection} from './handlers/database-connection'

// Create a logger
// This logger will go to a file and the console
export const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: 'trackless.log'
		})
	]
})

// Test if we need to use ssl
let ssl = {}

if (process.env.CA !== null && process.env.CA !== undefined) {
	ssl = {
		ssl: {
			ca: fs.readFileSync(process.env.CA)
		}
	}
}

// Setup the connection with the database
export const DBcon = createPool({
	host: process.env.DBhost ?? 'localhost',
	user: process.env.DBuser ?? '',
	password: process.env.DBpassword ?? '',
	database: process.env.DBdatabase ?? 'trackless',
	...ssl
})

// Test the connection to the database
DBcon.getConnection((error, connection) => {
	if (error) {
		logger.error('Mysql: connection failed', error)
	} else {
		logger.info('Mysql: Connected')
		connection.release()
	}
})

// Create a basic app (server)
export const server = express()
server.set('trust proxy', 1) // Disable this if you are not using a proxy
server.use(rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 100 // Max 100 request per minute
}))
server.use(bodyParser.urlencoded({
	extended: true
}))
server.use(bodyParser.json())
server.use(cors())
server.use(nocache())
server.use(passport.initialize())

// This will close the database connection at the end of each request
server.use(closeDatabaseConnection())

// Make sure that morgan uses winston for loggin
server.use(morgan('combined', {
	stream: {
		write: message => {
			logger.info(message)
		}
	}
}))

// Use passport
passport.use(new BearerStrategy(
	(token, done) => {
		apiLogin(token)
			.then(user => {
				done(null, user)
			})
			.catch(() => {
				done(null, false)
			})
	}
))

// Import routes
server.use('/access', accessRoute)
server.use('/api', apiRoute)
server.use('/group', groupRoute)
server.use('/location', locationRoute)
server.use('/login', loginRoute)
server.use('/setting', settingRoute)
server.use('/user', userRoute)
server.use('/work', workRoute)
server.use('/worktype', worktypeRoute)
server.use('/server/about', severAboutRoute)

// Docs route
server.get('/docs', (request, response) => {
	response.json(docs)
})

// Add 404 response
server.use((request, response, next) => {
	next(new ServerError(
		'The requested source was not found',
		404,
		'trackless.notFound'
	))
})

// Handle server errors
server.use(handleServerError())

// Start the server
const port = process.env.PORT ?? 55565

try {
	server.listen(port, () => {
		logger.info(`Server started on port: ${port}`)
	})
} catch {
	logger.warn(`port ${port} is in use`)
}
