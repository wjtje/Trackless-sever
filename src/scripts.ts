import { MysqlError } from "mysql";

export function generateString(length:number) : string {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;

  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

import { sqlErrorText } from './language';

export function sqlError(res, error:MysqlError) {
  // Report to the user
  res.send(JSON.stringify({
    status: 500,
    message: sqlErrorText,
    sqlError: error,
  }));

  res.status(500);

  console.log(error);
}