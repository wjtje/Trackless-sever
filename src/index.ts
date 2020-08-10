import { createConnection as mysqlCreateConnection } from 'mysql';
import express from 'express';
import bodyParser from 'body-parser';
import { Base64 } from 'js-base64';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import cors from 'cors';
import serverErrorHandler from './scripts/RequestHandler/serverErrorHandler';
import ServerError from './scripts/RequestHandler/serverErrorInterface';
import { apiLogin } from './scripts/apiLogin';

// Settings
const port:number = 55565;

// Import base64 string extension
Base64.extendString();

// Setup the connection with the database
export const DBcon = mysqlCreateConnection({
  host: "trackless",
  user: "yourusername",
  password: "yourpassword",
  database: "trackless"
});

// Connect to the database
DBcon.connect(function(err) {
  if (err) throw err;
  console.log("MYSQL: Connected!");
});

// Create a basic app (server)
export const server = express();
server.use(bodyParser.urlencoded({
  extended: true
}));
server.use(bodyParser.json());
server.use(cors());
server.use(passport.initialize());

// Use passport
passport.use(new BearerStrategy(
  function(token, done) {
    apiLogin(token).then((user) => {
      done(null, user);
    }).catch((err) => {
      done(null, false);
    })
  }
));

import './routes';

// Add 404 response
server.use((request, response, next) => {
  const error:ServerError = new Error('Not found');
  error.status = 404;
  error.code = 'trackless.notFound'
  next(error);
});

// Handle server errors
server.use(serverErrorHandler());

// Start the server
server.listen(port, () => {
  console.log("SERVER: Started! on " + port);
});