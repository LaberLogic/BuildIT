import { scopeCheckMaterial, scopeCheckSite } from "@utils/scopeCheck";
import { UpdateMaterialCountDto } from "shared";
import { CreateMaterialDto,UpdateMaterialDto } from "shared";
import { UserObject } from "types";

import {
  createMaterial,
  deleteMaterial,
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
  return scopeCheckMaterial(currentUser, siteId).andThen(() =>
    updateMaterial(
      { id: materialId },
      {
        amount: {
          increment: delta,
        },
      },
    ),
  );
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
