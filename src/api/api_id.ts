import Api from "../scripts/api";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseDone, responseNotFound } from "../scripts/response";

interface TL_api {
  api_id: number;
  createDate: string;
  lastUsed: string;
  deviceName: string;
}

new Api({
  url: '/api/:api_id',
  auth: true,
  get: (request, response, user) => {
    DBcon.query(
      "SELECT `api_id`, `createDate`, `lastUsed`, 'deviceName' FROM `TL_apikeys` WHERE `api_id`=? and `user_id`=?",
      [request.params.api_id, user.user_id],
      handleQuery(response, (result: Array<TL_api>) => {
        // Check if there is an api key / bearer token
        if (result.length == 0) {
          responseNotFound(response);
        } else {
          responseDone(response, {
            length: result.length,
            result: result,
          });
        }
      })
    )
  },
  delete: (request, response, user) => {
    DBcon.query(
      "DELETE FROM `TL_apikeys` WHERE `api_id`=? and `user_id`=?",
      [request.params.api_id, user.user_id],
      handleQuery(response, () => {
        responseDone(response);
      })
    )
  }
});