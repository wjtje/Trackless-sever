import { version } from "../global/about";
import { server } from "..";
import { responseBadRequest } from "../scripts/response";
import Api from "../scripts/api";

new Api({
  url: '/server/about',
  get: (request, response) => {
    response.send(JSON.stringify({
      version: version
    }));
  }
});