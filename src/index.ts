// Import all packages
import * as mysql from 'mysql';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Base64 } from 'js-base64';
import * as passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
var cors = require('cors');

// Settings
const port:number = 55565;

// Import base64 string extension
Base64.extendString();

// Setup the connection with the database
export const DBcon = mysql.createConnection({
  host: "localhost",
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
server.use(bodyParser.raw());
server.use(cors());
server.use(passport.initialize());

// Use passport
passport.use(new BearerStrategy(
  function(token, done) {
    apiLogin(token).then((user) => {
      done(null, user);
    }).catch((err) => {
      done(err);
    })
  }
));

// Import user commands
import './user/create';
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

// Import work commands
import './work/index';

// Import access commands
import './access/index';
import { apiLogin } from './api/lib';

// Custom error pages
server.use(function (req, res) {
  res.send(JSON.stringify({
    message: 'Couldn\'t found that api function',
    url: req.originalUrl
  }));
});

// Start the server
server.listen(port, () => {
  console.log("SERVER: Started! on " + port);
});