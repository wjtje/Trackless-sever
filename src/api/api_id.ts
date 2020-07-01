import Api from "../scripts/api";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseDone } from "../scripts/response";
import { checkApiId } from "../scripts/idCheck";


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
    checkApiId(request, response, user, () => {
      // Api_id is valid return info
      DBcon.query(
        "SELECT `api_id`, `createDate`, `lastUsed`, 'deviceName' FROM `TL_apikeys` WHERE `api_id`=? and `user_id`=?",
        [request.params.api_id, user.user_id],
        handleQuery(response, (result: Array<TL_api>) => {
          responseDone(response, {
            length: result.length,
            result: result,
          });
        })
      );
    });
  },
  delete: (request, response, user) => {
    checkApiId(request, response, user, () => {
      // Api_id is valid remove it
      DBcon.query(
        "DELETE FROM `TL_apikeys` WHERE `api_id`=? and `user_id`=?",
        [request.params.api_id, user.user_id],
        handleQuery(response, () => {
          responseDone(response);
        })
      );
    });
  }
});