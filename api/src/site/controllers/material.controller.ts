import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from "http-status";
import {
  CreateMaterialDto,
  UpdateMaterialCountDto,
  UpdateMaterialDto,
} from "shared";
import { UserObject } from "types";

import {
  createNewMaterial,
  deleteMaterialFromSite,
  incrementDecrementMaterial,
  updateMaterialProperties,
} from "../services/material.service";

/**
 * Controller to create a new material for a given site and company.
 *
 * @param {FastifyRequest<{ Params: { siteId: string; companyId: string }; Body: CreateMaterialDto }>} req - Request containing site/company ID and material data.
 * @param {FastifyReply} reply - Fastify reply object.
 * @returns {Promise<void>} Sends the created material or an error response.
 */
export const createMaterialController = async (
  req: FastifyRequest<{
    Params: { siteId: string; companyId: string };
    Body: CreateMaterialDto;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const { siteId, companyId } = req.params;
  const data = req.body;
  const currentUser = req.user;

  return createNewMaterial(currentUser, siteId, companyId, data).match(
    (material) => reply.status(httpStatus.CREATED).send(material),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller to update properties of an existing material.
 *
 * @param {FastifyRequest<{ Params: { siteId: string; materialId: string; companyId: string }; Body: UpdateMaterialDto }>} req - Request containing material/site/company IDs and updated data.
 * @param {FastifyReply} reply - Fastify reply object.
 * @returns {Promise<void>} Sends the updated material or an error response.
 */
export const updateMaterialController = async (
  req: FastifyRequest<{
    Params: { siteId: string; materialId: string; companyId: string };
    Body: UpdateMaterialDto;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const { siteId, materialId, companyId } = req.params;
  const data = req.body;
  const currentUser = req.user;

  return updateMaterialProperties(
    currentUser,
    companyId,
    siteId,
    materialId,
    data,
  ).match(
    (material) => reply.status(httpStatus.OK).send(material),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller to delete a material from a site.
 *
 * @param {FastifyRequest<{ Params: { siteId: string; materialId: string; companyId: string } }>} req - Request containing material/site/company IDs.
 * @param {FastifyReply} reply - Fastify reply object.
 * @returns {Promise<void>} Sends id  on success or an error response.
 */
export const deleteMaterialController = async (
  req: FastifyRequest<{
    Params: { siteId: string; materialId: string; companyId: string };
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const { siteId, materialId, companyId } = req.params;
  const currentUser = req.user;

  return deleteMaterialFromSite(
    currentUser,
    companyId,
    siteId,
    materialId,
  ).match(
    () => reply.status(httpStatus.NO_CONTENT).send(),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller to increment or decrement the quantity of a material.
 *
 * @param {FastifyRequest<{ Params: { siteId: string; materialId: string; companyId: string }; Body: UpdateMaterialCountDto }>} req - Request containing material/site/company IDs and quantity update.
 * @param {FastifyReply} reply - Fastify reply object.
 * @returns {Promise<void>} Sends the updated material or an error response.
 */
export const adjustMaterialQuantityController = async (
  req: FastifyRequest<{
    Params: { siteId: string; materialId: string; companyId: string };
    Body: UpdateMaterialCountDto;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const { siteId, materialId, companyId } = req.params;
  const data = req.body;
  const currentUser = req.user;

  return incrementDecrementMaterial(
    currentUser,
    companyId,
    siteId,
    materialId,
    data,
  ).match(
    (material) => reply.status(httpStatus.OK).send(material),
    (error) => sendChainedErrorReply(reply, error),
  );
};
