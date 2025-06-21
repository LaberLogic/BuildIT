import {
  getCurrentUser,
  getSiteById,
  getSites,
  signIn,
  wait,
} from "./common.js";

const BASE_URL = "http://localhost:3001";

export function setup() {
  const credentials = { email: "manager@example.com", password: "secret" };
  const token = signIn(credentials, BASE_URL);
  const user = getCurrentUser(BASE_URL, token);
  return { token, companyId: user.companyId };
}

export default function (data) {
  const { token, companyId } = data;

  // Query all sites under the user's company
  const sites = getSites(BASE_URL, token, companyId);

  // Pick first site
  if (sites.length > 0) {
    getSiteById(BASE_URL, token, companyId, sites[0].id);
  }

  // Query user info again (simulate user activity)
  getCurrentUser(BASE_URL, token);

  wait(1 + Math.random() * 2);
}

export const options = {
  stages: [
    { duration: "10s", target: 5 },
    { duration: "30s", target: 10 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<20"],
    http_req_failed: ["rate<0.005"],
  },
};
