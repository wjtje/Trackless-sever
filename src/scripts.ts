import { MysqlError } from "mysql";
import { DBcon } from './index';
import { missingError } from "./language";
import { apiLogin } from "./api/lib";
import _ = require("lodash");
import { sha512_256 } from "js-sha512";
import { Response, Request } from 'express';

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
export function sqlError(res: Response, error:MysqlError, errorMessage:string) {
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
export function missingErrorFun(res:Response, missing:string[], typeErr:string[]) {
  // Something is missing
  // throw an error
  res.send(JSON.stringify({
    status: 400,
    message: missingError,
    missing: missing,
    typeErr: typeErr
  }));

  res.status(400);
}

// Trow an error that login has failed
export function loginFault(res:Response): (reason: any) => void | PromiseLike<void> {
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
export function apiCheck(req:Request, res:Response, passed: (result: { user_id: number; username: string; }) => void) {
  if (_.has(req.body, "apiKey")) {
    apiLogin(req.body.apiKey).then(passed).catch(loginFault(res));
  } else {
    missingErrorFun(res, [`You are missing 'apiKey'.`],[]);
  }
}

// Simple script for handling a query
export function handleQuery(res: Response, errorMessage:string, then: (result: any) => void) {
  return (error, result) => {
    if (error) {
      sqlError(res, error, errorMessage);
    } else {
      then(result);
    }
  };
}

// Sent the result to the user
export function responseDone(res: Response, result?: object) {
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
interface reqDataObj {
  name: string;
  type: "number" | "string";
}

export function reqDataCheck(req: Request, res: Response, items:Array<reqDataObj>, fun:() => void) {
  let failed = false;
  let missing:string[] = [];
  let typeErr:string[] = [];

  // Run it async for more speed
  async function scanReqData() {
    await Promise.all(items.map(async (item) => {
      if (!_.has(req.body, item.name)) {
        failed = true;
        missing.push(`You are missing '${item.name}'.`);
      } else if ((typeof _.get(req.body, item.name)) !== item.type) {
        failed = true;
        typeErr.push(`Wrong type for ${item.name}. Expected ${item.type} but got ${typeof _.get(req.body, item.name)}`);
      }
    }));

    if (failed) {
      missingErrorFun(res, missing, typeErr);
    } else {
      fun();
    }
  }

  // Start the function
  scanReqData();
}

// Check an array of items
// That is does not include wrong values
export function arrayContainOnly(array: Array<string>, searchList: Array<string>) {
  return new Promise((resolve, reject) => {
    let isRejected = false;

    array.forEach(item => {
      if (!searchList.includes(item)) {
        isRejected = true;
        reject();
      }
    });
    
    if (!isRejected) {
      resolve();
    }
  });
}

// Store password
export function storePassword(password: string):string[] {
  const salt = generateString(32);

  const hash = sha512_256(password + salt);

  return [
    salt,
    hash
  ];
}