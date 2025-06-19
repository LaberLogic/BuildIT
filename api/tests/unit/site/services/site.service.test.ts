import { ROLE, SITE_STATUS } from "@prisma/prisma";
import { toSiteDTO } from "@src/site/dtos/site.dto";
import {
  createSite,
  deleteSiteAssignment,
  getSite,
  getSites,
  updateSite,
} from "@src/site/repositories/site.repository";
import {
  createNewSite,
  getSiteById,
  getSitesByCompanyId,
  getSitesByUserId,
  updateSiteById,
} from "@src/site/services/site.service";
import { ChainedError } from "@utils/chainedError";
import { errAsync, okAsync } from "neverthrow";
import { CreateSiteDto, SiteResponseDto, UpdateSiteDto } from "shared";
import { UserObject } from "types";

jest.mock("@src/site/repositories/site.repository");
jest.mock("@utils/scopeCheck", () => ({
  scopeCheckCompany: jest.fn(() => okAsync(true)),
  scopeCheckSiteAccess: jest.fn(() => okAsync(true)),
  extendSiteWhere: jest.fn((where) => where),
}));
jest.mock("@src/site/dtos/site.dto", () => ({
  toSiteDTO: jest.fn(),
}));

const mockedDeleteSiteAssignment = deleteSiteAssignment as jest.MockedFunction<
  typeof deleteSiteAssignment
>;

const mockedCreateSite = createSite as jest.MockedFunction<typeof createSite>;
const mockedGetSite = getSite as jest.MockedFunction<typeof getSite>;
const mockedGetSites = getSites as jest.MockedFunction<typeof getSites>;
const mockedUpdateSite = updateSite as jest.MockedFunction<typeof updateSite>;
const mockedToSiteDTO = toSiteDTO as jest.MockedFunction<typeof toSiteDTO>;

const createRawSite = () => ({
  id: "site-1",
  name: "New Site",
  status: SITE_STATUS.ACTIVE,
  priority: "medium",
  progress: 0,
  hoursLogged: 0,
  address: {
    street: "123 Main St",
    streetNumber: "123",
    city: "New York",
    country: "USA",
    postalCode: "12345",
  },
  companyId: "company-1",
  assignments: [
    {
      lastVisited: null,
      user: {
        id: "user-1",
        firstName: "John",
        lastName: "Doe",
      },
    },
  ],
  material: [],
  notes: null,
  startDate: new Date("2024-06-01T10:00:00Z"),
  endDate: new Date("2024-06-01T10:00:00Z"),
});

const baseSiteDTO: SiteResponseDto = {
  id: "site-1",
  name: "New Site",
  address: "123 Main St, New York, USA 12345",
  progress: 0,
  hoursLogged: 0,
  status: SITE_STATUS.ACTIVE,
  priority: "medium",
  materialInfo: { total: 0, warnings: 0 },
  material: [],
  chat: { unreadCount: 0, lastMessage: "" },
  lastVisited: new Date("2024-06-01T10:00:00Z"),
  assignments: [
    {
      userId: "user-1",
      firstName: "John",
      lastName: "Doe",
    },
  ],
  startDate: new Date("2024-06-01T10:00:00Z"),
  endDate: new Date("2024-06-01T10:00:00Z"),
};

describe("createNewSite", () => {
  const currentUser: UserObject = { id: "user-1", role: ROLE.ADMIN };
  const companyId = "company-1";

  describe("Business Logic", () => {
    it("should create site successfully", async () => {
      const createDto: CreateSiteDto = {
        users: ["user-2", "user-3"],
        address: createRawSite().address,
        name: "New Site",
      };

      mockedCreateSite.mockReturnValue(okAsync(createRawSite()));
      mockedToSiteDTO.mockReturnValue(baseSiteDTO);

      const result = await createNewSite(currentUser, createDto, companyId);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(baseSiteDTO);
    });
  });

  describe("Error Scenarios", () => {
    it("should return error if creation fails", async () => {
      const createDto: CreateSiteDto = {
        users: ["user-2"],
        address: createRawSite().address,
        name: "Failing Site",
      };

      mockedCreateSite.mockReturnValue(errAsync(new ChainedError("DB error")));

      const result = await createNewSite(currentUser, createDto, companyId);

      expect(result.isErr()).toBe(true);
    });
  });
});

describe("updateSiteById", () => {
  const currentUser: UserObject = { id: "user-1", role: ROLE.ADMIN };
  const siteId = "site-1";
  const companyId = "company-1";

  describe("Business Logic", () => {
    it("should update site successfully", async () => {
      const updateDto: UpdateSiteDto = {
        users: ["user-5"],
        name: "Updated Site",
      };

      mockedGetSite.mockReturnValue(okAsync(createRawSite()));
      mockedUpdateSite.mockReturnValue(okAsync(createRawSite()));
      mockedToSiteDTO.mockReturnValue(baseSiteDTO);
      mockedDeleteSiteAssignment.mockReturnValue(
        okAsync({
          id: "",
          lastVisited: new Date(),
          userId: "",
          siteId: "",
        }),
      );

      const result = await updateSiteById(
        currentUser,
        siteId,
        updateDto,
        companyId,
      );
      expect(result.isOk()).toBe(true);
      expect(mockedUpdateSite).toHaveBeenCalled();
    });
  });

  describe("Error Scenarios", () => {
    it("should return error if site not found", async () => {
      mockedGetSite.mockReturnValue(errAsync(new ChainedError("Not found")));

      const result = await updateSiteById(
        currentUser,
        siteId,
        { name: "X" },
        companyId,
      );

      expect(result.isErr()).toBe(true);
    });

    it("should return error if update fails", async () => {
      mockedGetSite.mockReturnValue(okAsync(createRawSite()));
      mockedUpdateSite.mockReturnValue(
        errAsync(new ChainedError("Update failed")),
      );

      const result = await updateSiteById(
        currentUser,
        siteId,
        { name: "Y" },
        companyId,
      );

      expect(result.isErr()).toBe(true);
    });
  });
});

describe("getSitesByUserId", () => {
  const currentUser: UserObject = { id: "user-1", role: ROLE.ADMIN };

  describe("Business Logic", () => {
    it("should return sites by user id", async () => {
      mockedGetSites.mockReturnValue(okAsync([createRawSite()]));
      mockedToSiteDTO.mockReturnValue(baseSiteDTO);

      const result = await getSitesByUserId("user-2", currentUser);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual([baseSiteDTO]);
    });
  });

  describe("Error Scenarios", () => {
    it("should return error if DB fails", async () => {
      mockedGetSites.mockReturnValue(errAsync(new ChainedError("DB failure")));

      const result = await getSitesByUserId("user-x", currentUser);

      expect(result.isErr()).toBe(true);
    });
  });
});

describe("getSitesByCompanyId", () => {
  const currentUser: UserObject = { id: "user-1", role: ROLE.ADMIN };
  const companyId = "company-1";

  describe("Business Logic", () => {
    it("should return sites by company id", async () => {
      mockedGetSites.mockReturnValue(okAsync([createRawSite()]));
      mockedToSiteDTO.mockReturnValue(baseSiteDTO);

      const result = await getSitesByCompanyId(companyId, currentUser);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual([baseSiteDTO]);
    });
  });

  describe("Error Scenarios", () => {
    it("should return error if query fails", async () => {
      mockedGetSites.mockReturnValue(errAsync(new ChainedError("Query error")));

      const result = await getSitesByCompanyId(companyId, currentUser);

      expect(result.isErr()).toBe(true);
    });
  });
});

describe("getSiteById", () => {
  const currentUser: UserObject = { id: "user-1", role: ROLE.ADMIN };
  const companyId = "company-1";
  const siteId = "site-1";

  describe("Business Logic", () => {
    it("should return site by id", async () => {
      mockedGetSite.mockReturnValue(okAsync(createRawSite()));
      mockedToSiteDTO.mockReturnValue(baseSiteDTO);

      const result = await getSiteById(siteId, currentUser, companyId);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(baseSiteDTO);
    });
  });

  describe("Error Scenarios", () => {
    it("should return error if site not found", async () => {
      mockedGetSite.mockReturnValue(errAsync(new ChainedError("Not found")));

      const result = await getSiteById("invalid-id", currentUser, companyId);

      expect(result.isErr()).toBe(true);
    });
  });
});
