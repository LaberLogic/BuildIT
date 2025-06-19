import { ROLE } from "@prisma/prisma";
import app from "@src/index";
import { User } from "@src/user/repositories/user.repository";
import request from "supertest";
import { UserObject } from "types";
export const createMockUser = (
  overrides: Partial<UserObject> = {},
): UserObject => {
  return {
    id: "mock-id",
    role: "WORKER",
    companyId: "company-1",
    ...overrides,
  };
};

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: "user-id",
  email: "user@example.com",
  firstName: "First",
  lastName: "Last",
  role: ROLE.WORKER,
  status: "ACTIVE",
  companyId: "company-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const getAccessToken = async (
  email: string,
  password: string,
): Promise<string> => {
  const res = await request(app.server)
    .post("/auth/signin")
    .send({ email, password });

  if (res.status !== 200 || !res.body.accessToken) {
    throw new Error(`Failed to sign in for ${email}. Status: ${res.status}`);
  }

  return res.body.accessToken;
};

import { seedAdmin, seedManager, seedWorker1 } from "../prisma/seed";

export const getAdminToken = () =>
  getAccessToken(seedAdmin.email, seedAdmin.password);
export const getManagerToken = () =>
  getAccessToken(seedManager.email, seedManager.password);
export const getWorkerToken = () =>
  getAccessToken(seedWorker1.email, seedWorker1.password);
