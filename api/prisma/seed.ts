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

  const address = await prisma.address.create({
    data: {
      streetNumber: "123",
      street: "Main St",
      city: "Sample City",
      country: "Countryland",
      postalCode: "12345",
    },
  });

  const company = await prisma.company.create({
    data: {
      name: "Awesome Company Ltd",
      addressId: address.id,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      password: await hash("secret", 10),
      role: "ADMIN",
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      email: "manager@example.com",
      firstName: "Manager",
      lastName: "User",
      password: await hash("secret", 10),
      role: "MANAGER",
      companyId: company.id,
    },
  });

  const workerUser = await prisma.user.create({
    data: {
      email: "worker@example.com",
      firstName: "Worker",
      lastName: "User",
      password: await hash("secret", 10),
      role: "WORKER",
      companyId: company.id,
    },
  });

  const siteAddress = await prisma.address.create({
    data: {
      streetNumber: "456",
      street: "Site Road",
      city: "Sample City",
      country: "Countryland",
      postalCode: "12345",
    },
  });

  const site = await prisma.site.create({
    data: {
      name: "Main Construction Site",
      addressId: siteAddress.id,
      companyId: company.id,
      status: "ACTIVE",
      startDate: new Date(),
    },
  });

  await prisma.siteAssignment.create({
    data: {
      userId: workerUser.id,
      siteId: site.id,
    },
  });

  await prisma.material.create({
    data: {
      name: "Concrete",
      unit: "cubic meters",
      amount: 100,
      threshold: 20,
      siteId: site.id,
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
