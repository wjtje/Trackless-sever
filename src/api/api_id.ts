import Api from "../scripts/api";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseDone } from "../scripts/response";

new Api({
  url: '/api/:api_id',
  auth: true,
  get: (request, response, user) => {
    DBcon.query(
      "SELECT `api_id`, `createDate`, `lastUsed`, 'deviceName' FROM `TL_apikeys` WHERE `api_id`=? and `user_id`=?",
      [request.params.api_id, user.user_id],
      handleQuery(response, `Couldn't find that api_id.`, (result) => {
        responseDone(response, {
          result: result
        });
      })
    )
  },
  delete: (request, response, user) => {
    DBcon.query(
      "DELETE FROM `TL_apikeys` WHERE `api_id`=? and `user_id`=?",
      [request.params.api_id, user.user_id],
      handleQuery(response, `Something went wrong.`, () => {
        responseDone(response);
      })
    )
  }
});