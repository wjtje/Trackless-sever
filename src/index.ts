// Copyright (c) 2020 Wouter van der Wal

import { createConnection as mysqlCreateConnection } from 'mysql'
import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import cors from 'cors'
import serverErrorHandler from './scripts/RequestHandler/serverErrorHandler'
import ServerError from './scripts/RequestHandler/serverErrorInterface'
import { apiLogin } from './scripts/apiLogin'
import { DBhost, DBuser, DBpassword, DBdatabase } from './user'
import morgan from 'morgan'
import accessRoute from './api/access'
import apiRoute from './api/api'
import groupRoute from './api/group'
import locationRoute from './api/location'
import loginRoute from './api/login'
import userRoute from './api/user'
import workRoute from './api/work'
import severAboutRoute from './api/server/about'

// Settings
const port:number = (process.env.PORT === undefined) ? 55565 : Number(process.env.PORT)

// Setup the connection with the database
export const DBcon = mysqlCreateConnection({
  host: DBhost,
  user: DBuser,
  password: DBpassword,
  database: DBdatabase
})

// Connect to the database
const connectInterval = setInterval(() => {
  DBcon.connect(function (err) {
    if (err) {
      console.log('MYSQL: FAILED!')
    } else {
      clearInterval(connectInterval)
      console.log('MYSQL: Connected!')
    }
  })
}, 2000)

// Create a basic app (server)
export const server = express()
server.use(bodyParser.urlencoded({
  extended: true
}))
server.use(bodyParser.json())
server.use(cors())
server.use(passport.initialize())
server.use(morgan('tiny'))

// Use passport
passport.use(new BearerStrategy(
  function (token, done) {
    apiLogin(token).then((user) => {
      done(null, user)
    }).catch(() => {
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
server.use('/user', userRoute)
server.use('/work', workRoute)
server.use('/server/about', severAboutRoute)

// Add 404 response
server.use((request, response, next) => {
  const error:ServerError = new Error('Not found')
  error.status = 404
  error.code = 'trackless.notFound'
  next(error)
})

// Handle server errors
server.use(serverErrorHandler())

// Start the server
try {
  server.listen(port, () => {
    console.log('SERVER: Started! on ' + port)
  })
} catch {
  console.log(`SERVER: ${port} is in use`)
}
