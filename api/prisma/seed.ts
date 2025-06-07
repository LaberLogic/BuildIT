import { createId } from "@paralleldrive/cuid2";
import { hash } from "bcryptjs";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { PrismaClient, ROLE, SITE_STATUS } from "../generated/prisma";

const prisma = new PrismaClient();
export const seedCompanyAddress = {
  id: createId(),
  streetNumber: "123",
  street: "Main St",
  city: "Sample City",
  country: "Countryland",
  postalCode: "12345",
};

export const seedSiteAddress1 = {
  id: createId(),
  streetNumber: "456",
  street: "Site Road",
  city: "Buildtown",
  country: "Countryland",
  postalCode: "12345",
};

export const seedSiteAddress2 = {
  id: createId(),
  streetNumber: "789",
  street: "Tower St",
  city: "Buildtown",
  country: "Countryland",
  postalCode: "12345",
};

export const seedCompany = {
  id: createId(),
  name: "Awesome Company Ltd",
  addressId: seedCompanyAddress.id,
};

export const seedAdmin = {
  id: createId(),
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  password: "secret",
  role: ROLE.ADMIN,
};

export const seedManager = {
  id: createId(),
  email: "manager@example.com",
  firstName: "Manager",
  lastName: "User",
  password: "secret",
  role: ROLE.MANAGER,
  companyId: seedCompany.id,
};

export const seedWorker1 = {
  id: createId(),
  email: "worker1@example.com",
  firstName: "Worker",
  lastName: "One",
  password: "secret",
  role: ROLE.WORKER,
  companyId: seedCompany.id,
};

export const seedWorker2 = {
  id: createId(),
  email: "worker2@example.com",
  firstName: "Worker",
  lastName: "Two",
  password: "secret",
  role: ROLE.WORKER,
  companyId: seedCompany.id,
};

export const seedSite1 = {
  id: createId(),
  name: "Main Construction Site",
  addressId: seedSiteAddress1.id,
  companyId: seedCompany.id,
  status: SITE_STATUS.ACTIVE,
  startDate: new Date("2025-04-01"),
  endDate: new Date("2025-07-01"),
  priority: "high",
  notes: "Top priority site. Requires weekly updates.",
};

export const seedSite2 = {
  id: createId(),
  name: "Downtown Tower",
  addressId: seedSiteAddress2.id,
  companyId: seedCompany.id,
  status: SITE_STATUS.ACTIVE,
  startDate: new Date("2025-05-01"),
  endDate: new Date("2025-10-01"),
  priority: "low",
  notes: "Tower project awaiting permit approval.",
};

export const seedSiteAssignments = [
  {
    siteId: seedSite1.id,
    userId: seedWorker1.id,
    lastVisited: new Date("2025-05-20"),
  },
  {
    siteId: seedSite1.id,
    userId: seedManager.id,
    lastVisited: new Date("2025-04-20"),
  },
  {
    siteId: seedSite2.id,
    userId: seedWorker2.id,
    lastVisited: new Date("2025-03-20"),
  },
];

export const seedMaterials = [
  {
    siteId: seedSite1.id,
    name: "Concrete",
    unit: "cubic meters",
    amount: 100,
    threshold: 25,
  },
  {
    siteId: seedSite1.id,
    name: "Rebar",
    unit: "tons",
    amount: 50,
    threshold: 10,
  },
  {
    siteId: seedSite2.id,
    name: "Glass Panels",
    unit: "units",
    amount: 200,
    threshold: 40,
  },
];

export async function seedDatabase() {
  await prisma.siteAssignment.deleteMany();
  await prisma.material.deleteMany();
  await prisma.site.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.address.deleteMany();

  await prisma.address.createMany({
    data: [seedCompanyAddress, seedSiteAddress1, seedSiteAddress2],
  });

  await prisma.company.create({ data: seedCompany });

  const users = [seedAdmin, seedManager, seedWorker1, seedWorker2];
  for (const user of users) {
    await prisma.user.create({
      data: {
        ...user,
        password: await hash(user.password, 10),
      },
    });
  }

  await prisma.site.createMany({
    data: [seedSite1, seedSite2],
  });

  await prisma.siteAssignment.createMany({ data: seedSiteAssignments });

  await prisma.material.createMany({ data: seedMaterials });

  console.log("Seed finished");
}

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  seedDatabase();
}
