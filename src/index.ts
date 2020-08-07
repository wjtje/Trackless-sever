// Import all packages
import { createConnection as mysqlCreateConnection } from 'mysql';
import express from 'express';
import bodyParser from 'body-parser';
import { Base64 } from 'js-base64';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import cors from 'cors';
import { apiFunctionNotFound } from './global/language';
import { serverError } from './scripts/error';

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

// Custom error
server.use(serverError() as any);

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

// Import user commands
import './user/index';
import './user/user_id';

// Import api commands
import './api/api_id';
import './api/index';

// Import groups commands
import './group/index';
import './group/group_id';

// Import location commands
import './location/index';
import './location/location_id';
import './location/user';

// Import work commands
import './work/index';
import './work/user';

// Import access commands
import './access/index';
import './access/access_id';
import './access/group';
import { apiLogin } from './api/lib';

// Import server commands
import './server/about';

// Custom error pages
server.use(function (req, res) {
  res.status(404);
  res.send(JSON.stringify({
    message: apiFunctionNotFound,
    url: req.originalUrl
  }));
});

// Start the server
server.listen(port, () => {
  console.log("SERVER: Started! on " + port);
});