import { ROLE } from "@prisma/prisma";
import * as repo from "@src/site/repositories/material.repostiory";
import {
  createNewMaterial,
  deleteMaterialFromSite,
  incrementDecrementMaterial,
  updateMaterialProperties,
} from "@src/site/services/material.service";
import { ChainedError } from "@utils/chainedError";
import * as scopeCheck from "@utils/scopeCheck";
import { errAsync, okAsync } from "neverthrow";

jest.mock("@src/site/repositories/material.repostiory");
const mockedCreateMaterial = repo.createMaterial as jest.Mock;
const mockedUpdateMaterial = repo.updateMaterial as jest.Mock;
const mockedDeleteMaterial = repo.deleteMaterial as jest.Mock;
const mockedGetMaterialById = repo.getMaterialById as jest.Mock;

const unauthorizedError = new ChainedError("Unauthorized", 403);
const dbError = new ChainedError("DB error", 500);

jest.mock("@utils/scopeCheck", () => ({
  scopeCheckCompany: jest.fn(() => okAsync(undefined)),
  scopeCheckSiteAccess: jest.fn(() => okAsync(undefined)),
}));

describe("material.service", () => {
  const currentUser = {
    id: "user-1",
    companyId: "company-1",
    role: ROLE.WORKER,
  };
  const siteId = "site-1";
  const materialId = "material-1";
  const companyId = currentUser.companyId;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createNewMaterial", () => {
    const data = { name: "Material A", unit: "kg", amount: 100, threshold: 10 };

    it("fails scope check", async () => {
      (scopeCheck.scopeCheckCompany as jest.Mock).mockReturnValueOnce(
        errAsync(unauthorizedError),
      );

      const result = await createNewMaterial(
        currentUser,
        siteId,
        companyId,
        data,
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(unauthorizedError.message);
      expect(mockedCreateMaterial).not.toHaveBeenCalled();
    });

    it("fails DB create", async () => {
      (scopeCheck.scopeCheckCompany as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      (scopeCheck.scopeCheckSiteAccess as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      mockedCreateMaterial.mockReturnValueOnce(errAsync(dbError));

      const result = await createNewMaterial(
        currentUser,
        siteId,
        companyId,
        data,
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(dbError.message);
      expect(mockedCreateMaterial).toHaveBeenCalledWith({
        ...data,
        site: { connect: { id: siteId } },
      });
    });

    it("succeeds", async () => {
      (scopeCheck.scopeCheckCompany as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      (scopeCheck.scopeCheckSiteAccess as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      const created = { id: materialId, ...data };
      mockedCreateMaterial.mockReturnValueOnce(okAsync(created));

      const result = await createNewMaterial(
        currentUser,
        siteId,
        companyId,
        data,
      );

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(
        expect.objectContaining({ id: materialId, ...data }),
      );
      expect(mockedCreateMaterial).toHaveBeenCalledWith({
        ...data,
        site: { connect: { id: siteId } },
      });
    });
  });

  describe("updateMaterialProperties", () => {
    const updateData = {
      name: "Material B",
      unit: "m",
      amount: 50,
      threshold: 5,
    };

    it("fails scope check", async () => {
      (scopeCheck.scopeCheckCompany as jest.Mock).mockReturnValueOnce(
        errAsync(unauthorizedError),
      );

      const result = await updateMaterialProperties(
        currentUser,
        companyId,
        siteId,
        materialId,
        updateData,
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(unauthorizedError.message);
      expect(mockedUpdateMaterial).not.toHaveBeenCalled();
    });

    it("fails DB update", async () => {
      (scopeCheck.scopeCheckCompany as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      (scopeCheck.scopeCheckSiteAccess as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      mockedUpdateMaterial.mockReturnValueOnce(errAsync(dbError));

      const result = await updateMaterialProperties(
        currentUser,
        companyId,
        siteId,
        materialId,
        updateData,
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(dbError.message);
      expect(mockedUpdateMaterial).toHaveBeenCalledWith(
        { id: materialId },
        updateData,
      );
    });

    it("succeeds", async () => {
      (scopeCheck.scopeCheckCompany as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      (scopeCheck.scopeCheckSiteAccess as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      const updated = { id: materialId, ...updateData };
      mockedUpdateMaterial.mockReturnValueOnce(okAsync(updated));

      const result = await updateMaterialProperties(
        currentUser,
        companyId,
        siteId,
        materialId,
        updateData,
      );

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(expect.objectContaining(updated));
      expect(mockedUpdateMaterial).toHaveBeenCalledWith(
        { id: materialId },
        updateData,
      );
    });
  });

  describe("incrementDecrementMaterial", () => {
    const delta = 10;

    it("fails scope check", async () => {
      (scopeCheck.scopeCheckCompany as jest.Mock).mockReturnValueOnce(
        errAsync(unauthorizedError),
      );

      const result = await incrementDecrementMaterial(
        currentUser,
        companyId,
        siteId,
        materialId,
        { delta },
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(unauthorizedError.message);
      expect(mockedUpdateMaterial).not.toHaveBeenCalled();
    });

    it("fails DB update", async () => {
      (scopeCheck.scopeCheckCompany as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      (scopeCheck.scopeCheckSiteAccess as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      mockedGetMaterialById.mockReturnValueOnce(
        okAsync({ id: materialId, amount: 40 }),
      );
      mockedUpdateMaterial.mockReturnValueOnce(errAsync(dbError));

      const result = await incrementDecrementMaterial(
        currentUser,
        companyId,
        siteId,
        materialId,
        { delta },
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(dbError.message);
      expect(mockedUpdateMaterial).toHaveBeenCalled();
    });

    it("fails if amount would be negative", async () => {
      (scopeCheck.scopeCheckCompany as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      (scopeCheck.scopeCheckSiteAccess as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      mockedGetMaterialById.mockReturnValueOnce(
        okAsync({ id: materialId, amount: 5 }),
      );

      const result = await incrementDecrementMaterial(
        currentUser,
        companyId,
        siteId,
        materialId,
        { delta: -10 },
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
       new ChainedError( "Material amount cannot be negative").message,
      );
      expect(mockedUpdateMaterial).not.toHaveBeenCalled();
    });

    it("succeeds", async () => {
      (scopeCheck.scopeCheckCompany as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      (scopeCheck.scopeCheckSiteAccess as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      mockedGetMaterialById.mockReturnValueOnce(
        okAsync({ id: materialId, amount: 40 }),
      );
      const updated = { id: materialId, amount: 50 };
      mockedUpdateMaterial.mockReturnValueOnce(okAsync(updated));

      const result = await incrementDecrementMaterial(
        currentUser,
        companyId,
        siteId,
        materialId,
        { delta },
      );

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(expect.objectContaining(updated));
      expect(mockedUpdateMaterial).toHaveBeenCalledWith(
        { id: materialId },
        { amount: { increment: delta } },
      );
    });
  });

  describe("deleteMaterialFromSite", () => {
    it("fails scope check", async () => {
      (scopeCheck.scopeCheckCompany as jest.Mock).mockReturnValueOnce(
        errAsync(unauthorizedError),
      );

      const result = await deleteMaterialFromSite(
        currentUser,
        companyId,
        siteId,
        materialId,
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(unauthorizedError.message);
      expect(mockedDeleteMaterial).not.toHaveBeenCalled();
    });

    it("fails DB delete", async () => {
      (scopeCheck.scopeCheckCompany as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      (scopeCheck.scopeCheckSiteAccess as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      mockedDeleteMaterial.mockReturnValueOnce(errAsync(dbError));

      const result = await deleteMaterialFromSite(
        currentUser,
        companyId,
        siteId,
        materialId,
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(dbError.message);
      expect(mockedDeleteMaterial).toHaveBeenCalledWith({ id: materialId });
    });

    it("succeeds", async () => {
      (scopeCheck.scopeCheckCompany as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      (scopeCheck.scopeCheckSiteAccess as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      mockedDeleteMaterial.mockReturnValueOnce(okAsync({ id: materialId }));

      const result = await deleteMaterialFromSite(
        currentUser,
        companyId,
        siteId,
        materialId,
      );

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({ id: materialId });
      expect(mockedDeleteMaterial).toHaveBeenCalledWith({ id: materialId });
    });
  });
});
