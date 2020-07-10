import { version } from "../global/about";
import { server } from "..";
import { responseBadRequest } from "../scripts/response";

server.route('/server/about')
  .get((request, response) => {
    response.send(JSON.stringify({
      version: version
    }))
  })
  .post(responseNotUsed())
  .patch(responseNotUsed())
  .delete(responseNotUsed());

function responseNotUsed() {
  return (request, response) => {
    responseBadRequest(response, {
      error: {
        message: `There is no method '${request.method}' on '/server/about'`,
      },
    });
  };
}
