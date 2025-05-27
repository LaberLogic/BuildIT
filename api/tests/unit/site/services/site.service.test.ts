import { ROLE } from "@prisma/prisma";
import {
  createNewSite,
  getSiteById,
  getSitesByCompanyId,
  getSitesByUserId,
  updateSiteById,
} from "@src/site/services/site.service";
import { okAsync } from "neverthrow";
import {
  createSite,
  getSite,
  getSites,
  updateSite,
} from "@src/site/repositories/site.repository";

jest.mock("@src/site/repositories/site.repository");

const mockedCreateSite = createSite as jest.Mock;
const mockedGetSite = getSite as jest.Mock;
const mockedGetSites = getSites as jest.Mock;
const mockedUpdateSite = updateSite as jest.Mock;

jest.mock("@utils/scopeCheck", () => ({
  scopeCheckSite: jest.fn(() => okAsync(true)),
  extendSiteWhere: jest.fn((where) => where),
}));

describe("site.service", () => {
  const currentUser = { id: "user-1", role: ROLE.ADMIN };
  const companyId = "company-1";
  const siteId = "site-1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createNewSite", () => {
    it("should create site successfully", async () => {
      const createDto = {
        companyId,
        userIds: ["user-2", "user-3"],
        address: {
          street: "123 Main St",
          streetNumber: "123",
          city: "New York",
          country: "USA",
          postalCode: "12345",
        },
        name: "New Site",
      };

      const createdSite = { id: siteId, name: "New Site" };
      mockedCreateSite.mockReturnValue(okAsync(createdSite));

      const result = await createNewSite(currentUser, createDto);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(createdSite);
      expect(mockedCreateSite).toHaveBeenCalledWith(
        expect.objectContaining({
          company: { connect: { id: companyId } },
          address: { create: createDto.address },
          assignments: {
            createMany: { data: [{ userId: "user-2" }, { userId: "user-3" }] },
          },
          name: "New Site",
        }),
      );
    });
  });

  describe("updateSiteById", () => {
    it("should update site successfully", async () => {
      const updateDto = {
        userIds: ["user-5"],
        name: "Updated Site",
      };
      const existingSite = { id: siteId, companyId };
      const updatedSite = { id: siteId, name: "Updated Site" };

      mockedGetSite.mockReturnValue(okAsync(existingSite));
      mockedUpdateSite.mockReturnValue(okAsync(updatedSite));

      const result = await updateSiteById(currentUser, siteId, updateDto);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(updatedSite);
      expect(mockedGetSite).toHaveBeenCalledWith({ id: siteId });
      expect(mockedUpdateSite).toHaveBeenCalledWith(
        { id: siteId },
        expect.objectContaining({
          name: "Updated Site",
          assignments: {
            set: [{ userId_siteId: { userId: "user-5", siteId } }],
          },
        }),
      );
    });
  });

  describe("getSitesByUserId", () => {
    it("should return sites by user id", async () => {
      const sites = [{ id: "site-1" }, { id: "site-2" }];
      mockedGetSites.mockReturnValue(okAsync(sites));

      const result = await getSitesByUserId("user-2", currentUser);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(sites);
      expect(mockedGetSites).toHaveBeenCalledWith(
        expect.objectContaining({ assignments: { some: { id: "user-2" } } }),
      );
    });
  });

  describe("getSitesByCompanyId", () => {
    it("should return sites by company id", async () => {
      const sites = [{ id: "site-3" }];
      mockedGetSites.mockReturnValue(okAsync(sites));

      const result = await getSitesByCompanyId(companyId, currentUser);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(sites);
      expect(mockedGetSites).toHaveBeenCalledWith(
        expect.objectContaining({ company: { id: companyId } }),
      );
    });
  });

  describe("getSiteById", () => {
    it("should return site by id", async () => {
      const site = { id: siteId, name: "Site One" };
      mockedGetSite.mockReturnValue(okAsync(site));

      const result = await getSiteById(siteId, currentUser);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(site);
      expect(mockedGetSite).toHaveBeenCalledWith(
        expect.objectContaining({ id: siteId }),
      );
    });
  });
});
