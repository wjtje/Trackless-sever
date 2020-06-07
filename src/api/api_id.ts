import { newApi, handleReject } from "../api";
import { DBcon } from "..";
import { handleQuery, responseDone } from "../scripts";

newApi("get", "/api/:api_id", [
  { name: "bearer", type: "string" }
], (request, response) => {
  DBcon.query(
    "SELECT `api_id`, `createDate`, `lastUsed`, 'deviceName' FROM `TL_apikeys` WHERE `api_id`=?",
    [request.params.api_id],
    handleQuery(response, `Couldn't find that api_id.`, (result) => {
      responseDone(response, {
        result: result
      });
    })
  )
}, handleReject());

newApi("delete", "/api/:api_id", [
  { name: "bearer", type: "string"}
], (request, response) => {
  DBcon.query(
    "DELETE FROM `TL_apikeys` WHERE `api_id`=?",
    [request.params.api_id],
    handleQuery(response, `Something went wrong.`, () => {
      responseDone(response);
    })
  )
}, handleReject());