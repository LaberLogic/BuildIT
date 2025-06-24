import { SITE_STATUS } from "@prisma/prisma";
import { toSiteDTO } from "@src/site/dtos/site.dto";
import { UserObject } from "types";

describe("toSiteDTO", () => {
  const user: UserObject = { id: "user-1", role: "ADMIN" };

  const site = {
    id: "site-123",
    name: "Test Site",
    priority: null,
    status: SITE_STATUS.ACTIVE,
    address: {
      streetNumber: "100",
      street: "Main St",
      city: "New York",
      country: "USA",
      postalCode: "10001",
    },
    companyId: "company-1",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    notes: null,
    assignments: [
      {
        lastVisited: new Date("2024-01-15"),
        user: {
          id: "user-1",
          firstName: "John",
          lastName: "Doe",
        },
      },
      {
        lastVisited: null,
        user: {
          id: "user-2",
          firstName: "Alice",
          lastName: "Smith",
        },
      },
    ],
    material: [
      {
        id: "mat-1",
        name: "Cement",
        unit: "kg",
        amount: 20,
        threshold: 50,
      },
      {
        id: "mat-2",
        name: "Bricks",
        unit: "pcs",
        amount: 200,
        threshold: 100,
      },
    ],
  };

  it("should map all fields correctly", () => {
    const dto = toSiteDTO(site, user);

    expect(dto).toEqual(
      expect.objectContaining({
        id: "site-123",
        name: "Test Site",
        address: "Main St 100, 10001 New York, USA",
        status: SITE_STATUS.ACTIVE,
        priority: "medium",
        hoursLogged: 0,
        progress: 100,

        materialInfo: {
          total: 2,
          warnings: 1, // only Cement triggers warning
        },
        material: site.material,
        chat: {
          unreadCount: 0,
          lastMessage: "",
        },
        lastVisited: new Date("2024-01-15"),
        assignments: [
          { userId: "user-1", firstName: "John", lastName: "Doe" },
          { userId: "user-2", firstName: "Alice", lastName: "Smith" },
        ],
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
      }),
    );
  });

  it("should calculate progress between startDate and endDate", () => {
    const now = new Date("2024-01-16");
    jest.useFakeTimers().setSystemTime(now);

    const dto = toSiteDTO(site, user);

    const totalDays = 30;
    const elapsedDays = 15;
    const expectedProgress = Math.round((elapsedDays / totalDays) * 100);

    expect(dto.progress).toBe(expectedProgress);

    jest.useRealTimers();
  });

  it("should return progress as 0 if no startDate", () => {
    const dto = toSiteDTO({ ...site, startDate: null }, user);
    expect(dto.progress).toBe(0);
  });

  it("should fallback to default values for missing optional fields", () => {
    const minimalSite = {
      ...site,
      priority: null,
      material: [],
      assignments: [],
    };

    const dto = toSiteDTO(minimalSite, user);

    expect(dto.priority).toBe("medium");
    expect(dto.materialInfo).toEqual({ total: 0, warnings: 0 });
    expect(dto.lastVisited).toBeUndefined();
  });

  it("should return 100 progress if startDate == endDate", () => {
    const singleDaySite = {
      ...site,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-05"),
    };

    jest.useFakeTimers().setSystemTime(new Date("2024-01-05"));
    const dto = toSiteDTO(singleDaySite, user);

    expect(dto.progress).toBe(100);

    jest.useRealTimers();
  });

  it("should clamp progress to max 100", () => {
    const siteWithPastEnd = {
      ...site,
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-01-31"),
    };

    const now = new Date("2025-01-01");
    jest.useFakeTimers().setSystemTime(now);

    const dto = toSiteDTO(siteWithPastEnd, user);

    expect(dto.progress).toBe(100);

    jest.useRealTimers();
  });
  it("should handle material being empty", () => {
    const dto = toSiteDTO({ ...site, material: [] }, user);
    expect(dto.materialInfo).toEqual({ total: 0, warnings: 0 });
  });

  it("should handle material array where all items are above threshold", () => {
    const safeMaterials = [
      {
        id: "m1",
        name: "Plaster",
        unit: "kg",
        amount: 100,
        threshold: 50,
      },
      {
        id: "m2",
        name: "Sand",
        unit: "kg",
        amount: 500,
        threshold: 300,
      },
    ];
    const dto = toSiteDTO({ ...site, material: safeMaterials }, user);
    expect(dto.materialInfo).toEqual({ total: 2, warnings: 0 });
  });

  it("should handle material array where all items are under threshold", () => {
    const lowMaterials = [
      {
        id: "m1",
        name: "Wood",
        unit: "pcs",
        amount: 20,
        threshold: 50,
      },
    ];
    const dto = toSiteDTO({ ...site, material: lowMaterials }, user);
    expect(dto.materialInfo).toEqual({ total: 1, warnings: 1 });
  });
});
