import { DBcon } from "..";
import { handleQuery } from "../scripts/handle";
import { responseDone } from "../scripts/response";
import Api from "../scripts/api";
import { checkAccessId } from "../scripts/idCheck";

new Api({
  url: '/access/:access_id',
  auth: true,
  delete: (request, response) => {
    checkAccessId(request, response, () => {
      // Remove the access
      DBcon.query(
        "DELETE FROM `TL_access` WHERE `access_id`=?",
        [request.params.access_id],
        handleQuery(response, () => {
          responseDone(response);
        })
      )
    });
  },
});