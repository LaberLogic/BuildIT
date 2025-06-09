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
import { errAsync,okAsync } from "neverthrow";

jest.mock("@src/site/repositories/material.repostiory");
const mockedCreateMaterial = repo.createMaterial as jest.Mock;
const mockedUpdateMaterial = repo.updateMaterial as jest.Mock;
const mockedDeleteMaterial = repo.deleteMaterial as jest.Mock;
const unauthorizedError = new ChainedError("Unauthorized", 403);
const dbError = new ChainedError("DB error", 500);
jest.mock("@utils/scopeCheck", () => ({
  scopeCheckSite: jest.fn(() => okAsync(undefined)),
  scopeCheckMaterial: jest.fn(() => okAsync(undefined)),
}));

describe("material.service", () => {
  const currentUser = {
    id: "user-1",
    companyId: "company-1",
    role: ROLE.WORKER,
  };
  const siteId = "site-1";
  const materialId = "material-1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createNewMaterial", () => {
    const data = { name: "Material A", unit: "kg", amount: 100, threshold: 10 };

    it("fails scope check", async () => {
      (scopeCheck.scopeCheckSite as jest.Mock).mockReturnValueOnce(
        errAsync(unauthorizedError),
      );

      const result = await createNewMaterial(currentUser, siteId, data);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(unauthorizedError.message);
      expect(mockedCreateMaterial).not.toHaveBeenCalled();
    });

    it("fails DB create", async () => {
      (scopeCheck.scopeCheckSite as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      mockedCreateMaterial.mockReturnValueOnce(errAsync(dbError));

      const result = await createNewMaterial(currentUser, siteId, data);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(dbError.message);
      expect(mockedCreateMaterial).toHaveBeenCalled();
    });

    it("succeeds", async () => {
      (scopeCheck.scopeCheckSite as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      const created = { id: materialId, ...data };
      mockedCreateMaterial.mockReturnValueOnce(okAsync(created));

      const result = await createNewMaterial(currentUser, siteId, data);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(created);
      expect(mockedCreateMaterial).toHaveBeenCalledWith(
        expect.objectContaining({
          site: { connect: { id: siteId } },
          ...data,
        }),
      );
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
      (scopeCheck.scopeCheckSite as jest.Mock).mockReturnValueOnce(
        errAsync(unauthorizedError),
      );

      const result = await updateMaterialProperties(
        currentUser,
        siteId,
        materialId,
        updateData,
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(unauthorizedError.message);
      expect(mockedUpdateMaterial).not.toHaveBeenCalled();
    });

    it("fails DB update", async () => {
      (scopeCheck.scopeCheckSite as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      mockedUpdateMaterial.mockReturnValueOnce(errAsync(dbError));

      const result = await updateMaterialProperties(
        currentUser,
        siteId,
        materialId,
        updateData,
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(dbError.message);
      expect(mockedUpdateMaterial).toHaveBeenCalled();
    });

    it("succeeds", async () => {
      (scopeCheck.scopeCheckSite as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      const updated = { id: materialId, ...updateData };
      mockedUpdateMaterial.mockReturnValueOnce(okAsync(updated));

      const result = await updateMaterialProperties(
        currentUser,
        siteId,
        materialId,
        updateData,
      );

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(updated);
      expect(mockedUpdateMaterial).toHaveBeenCalledWith(
        { id: materialId },
        updateData,
      );
    });
  });

  describe("incrementDecrementMaterial", () => {
    const delta = 10;

    it("fails scope check", async () => {
      (scopeCheck.scopeCheckMaterial as jest.Mock).mockReturnValueOnce(
        errAsync(unauthorizedError),
      );

      const result = await incrementDecrementMaterial(
        currentUser,
        siteId,
        materialId,
        { delta },
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(unauthorizedError.message);
      expect(mockedUpdateMaterial).not.toHaveBeenCalled();
    });

    it("fails DB update", async () => {
      (scopeCheck.scopeCheckMaterial as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      mockedUpdateMaterial.mockReturnValueOnce(errAsync(dbError));

      const result = await incrementDecrementMaterial(
        currentUser,
        siteId,
        materialId,
        { delta },
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(dbError.message);
      expect(mockedUpdateMaterial).toHaveBeenCalled();
    });

    it("succeeds", async () => {
      (scopeCheck.scopeCheckMaterial as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      const updated = { id: materialId, amount: 50 };
      mockedUpdateMaterial.mockReturnValueOnce(okAsync(updated));

      const result = await incrementDecrementMaterial(
        currentUser,
        siteId,
        materialId,
        { delta },
      );

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(updated);
      expect(mockedUpdateMaterial).toHaveBeenCalledWith(
        { id: materialId },
        { amount: { increment: delta } },
      );
    });
  });

  describe("deleteMaterialFromSite", () => {
    it("fails scope check", async () => {
      (scopeCheck.scopeCheckSite as jest.Mock).mockReturnValueOnce(
        errAsync(unauthorizedError),
      );

      const result = await deleteMaterialFromSite(
        currentUser,
        siteId,
        materialId,
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(unauthorizedError.message);
      expect(mockedDeleteMaterial).not.toHaveBeenCalled();
    });

    it("fails DB delete", async () => {
      (scopeCheck.scopeCheckSite as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      mockedDeleteMaterial.mockReturnValueOnce(errAsync(dbError));

      const result = await deleteMaterialFromSite(
        currentUser,
        siteId,
        materialId,
      );

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(dbError.message);
      expect(mockedDeleteMaterial).toHaveBeenCalled();
    });

    it("succeeds", async () => {
      (scopeCheck.scopeCheckSite as jest.Mock).mockReturnValueOnce(
        okAsync(undefined),
      );
      mockedDeleteMaterial.mockReturnValueOnce(okAsync({ id: materialId }));

      const result = await deleteMaterialFromSite(
        currentUser,
        siteId,
        materialId,
      );

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({ id: materialId });
      expect(mockedDeleteMaterial).toHaveBeenCalledWith({ id: materialId });
    });
  });
});
