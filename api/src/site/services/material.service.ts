import { ChainedError } from "@utils/chainedError";
import { scopeCheckMaterial, scopeCheckSite } from "@utils/scopeCheck";
import { errAsync } from "neverthrow";
import { UpdateMaterialCountDto } from "shared";
import { CreateMaterialDto, UpdateMaterialDto } from "shared";
import { UserObject } from "types";

import {
  createMaterial,
  deleteMaterial,
  getMaterialById,
  updateMaterial,
} from "../repositories/material.repostiory";

export const createNewMaterial = (
  currentUser: UserObject,
  siteId: string,
  data: CreateMaterialDto,
) => {
  return scopeCheckSite(currentUser, siteId).andThen(() =>
    createMaterial(mapCreateBodyToPayload(siteId, data)),
  );
};

export const updateMaterialProperties = (
  currentUser: UserObject,
  siteId: string,
  materialId: string,
  data: UpdateMaterialDto,
) => {
  return scopeCheckSite(currentUser, siteId).andThen(() =>
    updateMaterial({ id: materialId }, data),
  );
};

export const incrementDecrementMaterial = (
  currentUser: UserObject,
  siteId: string,
  materialId: string,
  { delta }: UpdateMaterialCountDto,
) => {
  return scopeCheckMaterial(currentUser, siteId)
    .andThen(() => getMaterialById({ id: materialId }))
    .andThen((material) => {
      if (material.amount + delta < 0) {
        return errAsync(
          new ChainedError("Material amount cannot be negative", 401),
        );
      }

      return updateMaterial(
        { id: materialId },
        { amount: { increment: delta } },
      );
    });
};

export const deleteMaterialFromSite = (
  currentUser: UserObject,
  siteId: string,
  materialId: string,
) => {
  return scopeCheckSite(currentUser, siteId).andThen(() =>
    deleteMaterial({ id: materialId }),
  );
};

export const mapCreateBodyToPayload = (
  siteId: string,
  data: CreateMaterialDto,
) => {
  return {
    ...data,
    site: {
      connect: {
        id: siteId,
      },
    },
  };
};
