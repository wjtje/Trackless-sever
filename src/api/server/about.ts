import { version } from "../../global/about";
import Api from "../../scripts/api";

new Api({
  url: '/server/about',
  get: (request, response) => {
    response.status(200).json({
      version: version
    });
  }
});