// Import all packages
import * as mysql from 'mysql';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Base64 } from 'js-base64';

// Settings
const port:number = 55565;

// Import base64 string extension
Base64.extendString();

// Setup the connection with the database
export const DBcon = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "trakless"
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

// Import user commands
import './user/create';
import './user/index';
import './user/user_id';

// Import api commands
import './api/create';
import './api/index';

// Start the server
server.listen(port, () => {
  console.log("SERVER: Started! on " + port);
});