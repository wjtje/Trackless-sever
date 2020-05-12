import { MysqlError } from "mysql";
import { DBcon } from './index';

export function generateString(length:number) : string {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;

  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function sqlError(res, error:MysqlError, errorMessage:string) {
  // Report to the user
  res.send(JSON.stringify({
    status: 500,
    message: errorMessage,
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