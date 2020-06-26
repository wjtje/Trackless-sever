import { apiLogin } from "./api/lib";
import _ = require("lodash");
import { Response, Request } from 'express';
import { sqlError, missingError } from "./scripts/error";

/*
// Trow an error that login has failed
export function loginFault(res:Response): (reason: any) => void | PromiseLike<void> {
  return (reason) => {
    // Couldn't login
    res.status(400);
    res.send({
      status: 400,
      message: reason
    });
  };
}

// Simple script for an api check
export function apiCheck(req:Request, res:Response, passed: (result: { user_id: number; username: string; }) => void) {
  if (_.has(req.body, "apiKey")) {
    apiLogin(req.body.apiKey).then(passed).catch(loginFault(res));
  } else {
    missingError(res, [`You are missing 'apiKey'.`],[]);
  }
}
*/