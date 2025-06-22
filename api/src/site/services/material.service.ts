import { ChainedError } from "@utils/chainedError";
import { scopeCheckCompany, scopeCheckSiteAccess } from "@utils/scopeCheck";
import { errAsync, ResultAsync } from "neverthrow";
import {
  CreateMaterialDto,
  MaterialResponseDto,
  UpdateMaterialCountDto,
  UpdateMaterialDto,
} from "shared";
import { UserObject } from "types";

import { toMaterialDTO } from "../dtos/material.dto";
import {
  createMaterial,
  deleteMaterial,
  getMaterialById,
  Material,
  updateMaterial,
} from "../repositories/material.repostiory";
/**
 * Creates a new material for a specific site under a company after validating access.
 *
 * @param currentUser - The user performing the operation.
 * @param siteId - The ID of the site the material belongs to.
 * @param companyId - The ID of the company that owns the site.
 * @param data - The data required to create a material.
 * @returns A ResultAsync containing the created MaterialResponseDto or a ChainedError.
 */
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

/**
 * Updates the properties of a material (excluding count) after validating access.
 *
 * @param currentUser - The user performing the operation.
 * @param companyId - The ID of the company that owns the site.
 * @param siteId - The ID of the site the material belongs to.
 * @param materialId - The ID of the material to update.
 * @param data - The data to update the material with.
 * @returns A ResultAsync containing the updated MaterialResponseDto or a ChainedError.
 */
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
    .map((material: Material) => toMaterialDTO(material));
};

/**
 * Increments or decrements the amount of a material, ensuring it doesn't go below zero.
 *
 * @param currentUser - The user performing the operation.
 * @param companyId - The ID of the company that owns the site.
 * @param siteId - The ID of the site the material belongs to.
 * @param materialId - The ID of the material to update.
 * @param delta - Object containing the amount to increment or decrement.
 * @returns A ResultAsync containing the updated MaterialResponseDto or a ChainedError.
 */
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
      if (material.amount + delta < 0) {
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

/**
 * Deletes a material from a site after validating access.
 *
 * @param currentUser - The user performing the operation.
 * @param companyId - The ID of the company that owns the site.
 * @param siteId - The ID of the site the material belongs to.
 * @param materialId - The ID of the material to delete.
 * @returns A ResultAsync containing the ID of the deleted material or a ChainedError.
 */
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

/**
 * Maps the request body to a Prisma-compatible material creation payload.
 *
 * @param siteId - The ID of the site to associate with the new material.
 * @param data - The data from the create material request body.
 * @returns An object formatted for Prisma's createMaterial method.
 */
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
