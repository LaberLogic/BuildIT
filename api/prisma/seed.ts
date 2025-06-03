import { PrismaClient } from "../generated/prisma";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteAssignment.deleteMany();
  await prisma.material.deleteMany();
  await prisma.site.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.address.deleteMany();

  const companyAddress = await prisma.address.create({
    data: {
      streetNumber: "123",
      street: "Main St",
      city: "Sample City",
      country: "Countryland",
      postalCode: "12345",
    },
  });

  const siteAddress1 = await prisma.address.create({
    data: {
      streetNumber: "456",
      street: "Site Road",
      city: "Buildtown",
      country: "Countryland",
      postalCode: "12345",
    },
  });

  const siteAddress2 = await prisma.address.create({
    data: {
      streetNumber: "789",
      street: "Tower St",
      city: "Buildtown",
      country: "Countryland",
      postalCode: "12345",
    },
  });

  // Company
  const company = await prisma.company.create({
    data: {
      name: "Awesome Company Ltd",
      addressId: companyAddress.id,
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      password: await hash("secret", 10),
      role: "ADMIN",
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: "manager@example.com",
      firstName: "Manager",
      lastName: "User",
      password: await hash("secret", 10),
      role: "MANAGER",
      companyId: company.id,
    },
  });

  const worker1 = await prisma.user.create({
    data: {
      email: "worker1@example.com",
      firstName: "Worker",
      lastName: "One",
      password: await hash("secret", 10),
      role: "WORKER",
      companyId: company.id,
    },
  });

  const worker2 = await prisma.user.create({
    data: {
      email: "worker2@example.com",
      firstName: "Worker",
      lastName: "Two",
      password: await hash("secret", 10),
      role: "WORKER",
      companyId: company.id,
    },
  });

  const site1 = await prisma.site.create({
    data: {
      name: "Main Construction Site",
      addressId: siteAddress1.id,
      companyId: company.id,
      status: "ACTIVE",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2025-07-01"),
      priority: "high",
      notes: "Top priority site. Requires weekly updates.",
    },
  });

  const site2 = await prisma.site.create({
    data: {
      name: "Downtown Tower",
      addressId: siteAddress2.id,
      companyId: company.id,
      status: "ACTIVE",
      startDate: new Date("2025-05-01"),
      endDate: new Date("2025-10-01"),
      priority: "low",
      notes: "Tower project awaiting permit approval.",
    },
  });

  await prisma.siteAssignment.createMany({
    data: [
      {
        siteId: site1.id,
        userId: worker1.id,
        lastVisited: new Date("2025-05-20"),
      },
      {
        siteId: site1.id,
        userId: manager.id,
        lastVisited: new Date("2025-04-20"),
      },
      {
        siteId: site2.id,
        userId: worker2.id,
        lastVisited: new Date("2025-03-20"),
      },
    ],
  });

  // Materials
  await prisma.material.createMany({
    data: [
      {
        siteId: site1.id,
        name: "Concrete",
        unit: "cubic meters",
        amount: 100,
        threshold: 25,
      },
      {
        siteId: site1.id,
        name: "Rebar",
        unit: "tons",
        amount: 50,
        threshold: 10,
      },
      {
        siteId: site2.id,
        name: "Glass Panels",
        unit: "units",
        amount: 200,
        threshold: 40,
      },
    ],
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
