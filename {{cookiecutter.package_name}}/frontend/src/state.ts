import { User } from "@snowind/state";
import Api from "./api";
import { apiServerUrl } from "./conf";

const user = new User();
let api: Api = new Api(apiServerUrl);

function initState() {
  console.log("Host:", window.location.hostname)
  if (import.meta.env.DEV) {
    api = new Api(`https://${window.location.hostname}:8000`);
  }
  // api
  api = new Api(apiServerUrl)
}

export { user, api, initState }