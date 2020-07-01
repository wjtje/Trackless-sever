import Api from "../scripts/api";
import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseDone } from "../scripts/response";
import { checkGroupId } from "../scripts/idCheck";

new Api({
  url: '/access/group/:group_id',
  auth: true,
  get: (request, response, user) => {
    checkGroupId(request, response, () => {
      DBcon.query(
        "SELECT `method`, `url` FROM `TL_access` WHERE `group_id`=?",
        [[(request.params.group_id == '~')? user.group_id:request.params.group_id]],
        handleQuery(response, (result) => {
          responseDone(response, {
            length: result.length,
            result: result
          });
        })
      );
    });
  }
});