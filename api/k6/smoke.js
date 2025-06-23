import { getCurrentUser, getSites, signIn } from "./common.js";

export const options = {
  vus: 1,
  duration: "10s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<200"],
  },
};

const BASE_URL = "http://localhost:3001";
const userCredentials = { email: "manager@example.com", password: "secret" };

export default function () {
  const token = signIn(userCredentials, BASE_URL);
  const user = getCurrentUser(BASE_URL, token);
  const companyId = user.companyId;
  getSites(BASE_URL, token, companyId);
}
