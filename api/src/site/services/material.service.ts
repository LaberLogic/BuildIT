import { ChainedError } from "@utils/chainedError";
import { scopeCheckCompany, scopeCheckSiteAccess } from "@utils/scopeCheck";
import { errAsync, ResultAsync } from "neverthrow";
import { MaterialResponseDto, UpdateMaterialCountDto } from "shared";
import { CreateMaterialDto, UpdateMaterialDto } from "shared";
import { UserObject } from "types";

import { toMaterialDTO } from "../dtos/material.dto";
import {
  createMaterial,
  deleteMaterial,
  getMaterialById,
  Material,
  updateMaterial,
} from "../repositories/material.repostiory";

export const createNewMaterial = (
  currentUser: UserObject,
  siteId: string,
  companyId: string,
  data: CreateMaterialDto,
): ResultAsync<MaterialResponseDto, ChainedError> => {
  return scopeCheckCompany(currentUser, companyId)
    .andThen(() => scopeCheckSiteAccess(currentUser, siteId, companyId))
    .andThen(() =>
      createMaterial(mapCreateBodyToPayload(siteId, data)).map((material) =>
        toMaterialDTO(material),
      ),
    );
};

export const updateMaterialProperties = (
  currentUser: UserObject,
  companyId: string,
  siteId: string,
  materialId: string,
  data: UpdateMaterialDto,
): ResultAsync<MaterialResponseDto, ChainedError> => {
  return scopeCheckCompany(currentUser, companyId)
    .andThen(() => scopeCheckSiteAccess(currentUser, siteId, companyId))
    .andThen(() => updateMaterial({ id: materialId }, data))
    .map((material: Material) => toMaterialDTO(material))
    .mapErr((e) => {
      console.log(e);
      return e;
    });
};

export const incrementDecrementMaterial = (
  currentUser: UserObject,
  companyId: string,
  siteId: string,
  materialId: string,
  { delta }: UpdateMaterialCountDto,
): ResultAsync<MaterialResponseDto, ChainedError> => {
  return scopeCheckCompany(currentUser, companyId)
    .andThen(() => scopeCheckSiteAccess(currentUser, siteId, companyId))
    .andThen(() => getMaterialById({ id: materialId }))
    .andThen((material: Material) => {
      console.log("REACHED");
      if (material.amount + delta < 0) {
        console.log("REACHED2");
        return errAsync(
          new ChainedError("Material amount cannot be negative", 403),
        );
      }

      return updateMaterial(
        { id: materialId },
        { amount: { increment: delta } },
      );
    })
    .map((material: Material) => toMaterialDTO(material));
};

export const deleteMaterialFromSite = (
  currentUser: UserObject,
  companyId: string,
  siteId: string,
  materialId: string,
): ResultAsync<{ id: string }, ChainedError> => {
  return scopeCheckCompany(currentUser, companyId)
    .andThen(() => scopeCheckSiteAccess(currentUser, siteId, companyId))
    .andThen(() => deleteMaterial({ id: materialId }));
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
