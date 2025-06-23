import { check, sleep } from "k6";
import http from "k6/http";

export function validateSignInResponse(res) {
  const body = res.json();
  return (
    typeof body === "object" &&
    typeof body.accessToken === "string" &&
    typeof body.user === "object" &&
    typeof body.user.id === "string" &&
    typeof body.user.email === "string" &&
    typeof body.user.companyId === "string"
  );
}

export function validateUserResponse(res) {
  const user = res.json();
  return (
    typeof user.id === "string" &&
    typeof user.email === "string" &&
    typeof user.createdAt === "string" &&
    typeof user.companyId === "string"
  );
}

export function validateSitesResponse(res) {
  const sites = res.json();
  return (
    Array.isArray(sites) &&
    sites.length > 0 &&
    typeof sites[0].id === "string" &&
    typeof sites[0].name === "string"
  );
}

export function validateSiteResponse(res) {
  const site = res.json();
  return typeof site.id === "string" && typeof site.name === "string";
}

export function signIn(credentials, baseUrl) {
  const res = http.post(`${baseUrl}/auth/signin`, JSON.stringify(credentials), {
    headers: { "Content-Type": "application/json" },
  });

  check(res, {
    "sign-in status is 200": (r) => r.status === 200,
    "sign-in returns valid structure": validateSignInResponse,
  });

  return res.json("accessToken");
}

export function getCurrentUser(baseUrl, token) {
  const res = http.get(`${baseUrl}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(res, {
    "user/me status is 200": (r) => r.status === 200,
    "user/me returns valid structure": validateUserResponse,
  });

  return res.json();
}

export function getSites(baseUrl, token, companyId) {
  const res = http.get(`${baseUrl}/companies/${companyId}/sites`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(res, {
    "sites status is 200": (r) => r.status === 200,
    "sites response valid": validateSitesResponse,
  });

  return res.json();
}

export function getSiteById(baseUrl, token, companyId, siteId) {
  const res = http.get(`${baseUrl}/companies/${companyId}/sites/${siteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(res, {
    "single site status is 200": (r) => r.status === 200,
    "single site response valid": validateSiteResponse,
  });

  return res.json();
}

export function wait(seconds = 1) {
  sleep(seconds);
}
