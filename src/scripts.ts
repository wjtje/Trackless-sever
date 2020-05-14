import { MysqlError } from "mysql";
import { DBcon } from './index';
import { missingError } from "./language";
import { apiLogin } from "./api/lib";
import _ = require("lodash");

// Generate a random string
export function generateString(length:number) : string {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;

  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

// Trow an sql error and save it
export function sqlError(res, error:MysqlError, errorMessage:string) {
  // Report to the user
  res.send(JSON.stringify({
    status: 500,
    message: errorMessage + ` (${error.code})`,
  }));

  res.status(500);

  DBcon.query(
    "INSERT INTO `TL_errors` (`sqlError`, `message`) VALUES (?,?)",
    [
      JSON.stringify(error),
      errorMessage
    ]
  );

  console.log(error);
}

// Trow an error that something is missing
export function missingErrorFun(res) {
  // Something is missing
  // throw an error
  res.send(JSON.stringify({
    status: 400,
    message: missingError
  }));
  res.status(400);
}

// Trow an error that login has failed
export function loginFault(res): (reason: any) => void | PromiseLike<void> {
  return (reason) => {
    // Couldn't login
    res.send({
      status: 400,
      message: reason
    });
    res.status(400);
  };
}

// Simple script for an api check
export function apiCheck(req, res, passed: (result: { user_id: number; username: string; }) => void) {
  if (_.has(req.body, "apiKey")) {
    apiLogin(req.body.apiKey).then(passed).catch(loginFault(res));
  }
  else {
    missingErrorFun(res);
  }
}

// Simple script for handling a query
export function handleQuery(res, errorMessage:string, then: (result: any) => void) {
  return (error, result) => {
    if (error) {
      sqlError(res, error, errorMessage);
    } else {
      then(result);
    }
  };
}

// Sent the result to the user
export function responseDone(res, result?) {
  if (result) {
    res.send(JSON.stringify({
      status: 200,
      message: 'done',
      ...result
    }));

    res.status(200);
  } else {
    res.send(JSON.stringify({
      status: 200,
      message: 'done'
    }));

    res.status(200);
  }
}

// Check an array of items
export function reqDataCheck(req, res, items:Array<string>, fun:() => void) {
  let passed = true;

  // Check all the items
  items.forEach((item) => {
    if (!_.has(req.body, item) && _.get(req.body, item) != '') {
      // You are missing something
      passed = false;

      missingErrorFun(res);
    }
  });

  // Passed?
  if (passed) {
    fun();
  }
}