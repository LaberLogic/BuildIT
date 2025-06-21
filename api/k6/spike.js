
import {
  getCurrentUser,
  getSiteById,
  getSites,
  signIn,
  wait,
} from "./common.js";

export const options = {
  stages: [
    { duration: "5s", target: 0 },
    { duration: "10s", target: 50 },
    { duration: "10s", target: 50 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<150"],
    http_req_failed: ["rate<0.01"],
  },
};

const BASE_URL = "http://localhost:3001";
const userCredentials = { email: "manager@example.com", password: "secret" };

export function setup() {
  const token = signIn(userCredentials, BASE_URL);
  return { token };
}

export default function (data) {
  const token = data.token;

  const user = getCurrentUser(BASE_URL, token);
  const companyId = user.companyId;

  const sites = getSites(BASE_URL, token, companyId);

  if (sites.length > 0) {
    const siteId = sites[0].id;
    getSiteById(BASE_URL, token, companyId, siteId);
  }

  wait(0.5);
}
