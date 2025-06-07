import { ROLE } from "@prisma/prisma";
import {
  createSite,
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
import { toSiteDTO } from "@src/site/site.dto";
import { okAsync } from "neverthrow";

jest.mock("@src/site/repositories/site.repository");

const mockedCreateSite = createSite as jest.Mock;
const mockedGetSite = getSite as jest.Mock;
const mockedGetSites = getSites as jest.Mock;
const mockedUpdateSite = updateSite as jest.Mock;

jest.mock("@utils/scopeCheck", () => ({
  scopeCheckCompany: jest.fn(() => okAsync(true)),
  extendSiteWhere: jest.fn((where) => where),
}));

jest.mock("@src/site/site.dto", () => ({
  toSiteDTO: jest.fn(),
}));

describe("site.service", () => {
  const currentUser = { id: "user-1", role: ROLE.ADMIN };
  const companyId = "company-1";
  const siteId = "site-1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    const rawCreatedSite = { id: siteId, name: "New Site" };
    const siteDTO = { id: siteId, name: "New Site", status: "active" };

    mockedCreateSite.mockReturnValue(okAsync(rawCreatedSite));
    (toSiteDTO as jest.Mock).mockReturnValue(siteDTO);

    const result = await createNewSite(currentUser, createDto);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(siteDTO);

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

    expect(toSiteDTO).toHaveBeenCalledWith(rawCreatedSite, currentUser);
  });

  describe("updateSiteById", () => {
    it("should update site successfully", async () => {
      const updateDto = {
        userIds: ["user-5"],
        name: "Updated Site",
      };

      const existingSite = { id: siteId, companyId };
      const updatedRawSite = { id: siteId, name: "Updated Site" };
      const updatedDTO = {
        id: siteId,
        name: "Updated Site",
        status: "active",
      };

      mockedGetSite.mockReturnValue(okAsync(existingSite));
      mockedUpdateSite.mockReturnValue(okAsync(updatedRawSite));
      (toSiteDTO as jest.Mock).mockReturnValue(updatedDTO);

      const result = await updateSiteById(currentUser, siteId, updateDto);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(updatedDTO);
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
      expect(toSiteDTO).toHaveBeenCalledWith(updatedRawSite, currentUser);
    });
  });

  describe("getSitesByUserId", () => {
    it("should return sites by user id", async () => {
      const rawSites = [
        { id: "site-1", name: "Site A" },
        { id: "site-2", name: "Site B" },
      ];
      const siteDTOs = [
        { id: "site-1", name: "Site A", status: "active" },
        { id: "site-2", name: "Site B", status: "active" },
      ];

      mockedGetSites.mockReturnValue(okAsync(rawSites));
      (toSiteDTO as jest.Mock)
        .mockReturnValueOnce(siteDTOs[0])
        .mockReturnValueOnce(siteDTOs[1]);

      const result = await getSitesByUserId("user-2", currentUser);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(siteDTOs);
      expect(mockedGetSites).toHaveBeenCalledWith(
        expect.objectContaining({ assignments: { some: { id: "user-2" } } }),
      );
      expect(toSiteDTO).toHaveBeenCalledTimes(2);
    });
  });

  describe("getSitesByCompanyId", () => {
    it("should return sites by company id", async () => {
      const rawSites = [{ id: "site-3", name: "Company Site" }];
      const siteDTOs = [
        { id: "site-3", name: "Company Site", status: "active" },
      ];

      mockedGetSites.mockReturnValue(okAsync(rawSites));
      (toSiteDTO as jest.Mock).mockReturnValueOnce(siteDTOs[0]);

      const result = await getSitesByCompanyId(companyId, currentUser);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(siteDTOs);
      expect(mockedGetSites).toHaveBeenCalledWith(
        expect.objectContaining({ company: { id: companyId } }),
      );
      expect(toSiteDTO).toHaveBeenCalledWith(rawSites[0], currentUser);
    });
  });

  describe("getSiteById", () => {
    it("should return site by id", async () => {
      const rawSite = { id: siteId, name: "Site One" };
      const siteDTO = { id: siteId, name: "Site One", status: "active" };

      mockedGetSite.mockReturnValue(okAsync(rawSite));
      (toSiteDTO as jest.Mock).mockReturnValue(siteDTO);

      const result = await getSiteById(siteId, currentUser);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(siteDTO);
      expect(mockedGetSite).toHaveBeenCalledWith(
        expect.objectContaining({ id: siteId }),
      );
      expect(toSiteDTO).toHaveBeenCalledWith(rawSite, currentUser);
    });
  });
});
