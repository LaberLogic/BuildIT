import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from "http-status";
import { UpdateMaterialDto } from "shared";
import { CreateMaterialDto } from "shared";
import { UpdateMaterialCountDto } from "shared";
import { UserObject } from "types";

import {
  createNewMaterial,
  deleteMaterialFromSite,
  incrementDecrementMaterial,
  updateMaterialProperties,
} from "../services/material.service";

export const createMaterialController = async (
  req: FastifyRequest<{
    Params: { siteId: string; companyId: string };
    Body: CreateMaterialDto;
  }>,
  reply: FastifyReply,
) => {
  const { siteId, companyId } = req.params;
  const data = req.body;
  const currentUser = req.user as UserObject;

  return createNewMaterial(currentUser, siteId, companyId, data).match(
    (material) => reply.status(httpStatus.CREATED).send(material),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const updateMaterialController = async (
  req: FastifyRequest<{
    Params: { siteId: string; materialId: string; companyId: string };
    Body: UpdateMaterialDto;
  }>,
  reply: FastifyReply,
) => {
  const { siteId, materialId, companyId } = req.params;
  const data = req.body;

  console.log(companyId);
  const currentUser = req.user as UserObject;

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

export const deleteMaterialController = async (
  req: FastifyRequest<{
    Params: { siteId: string; materialId: string; companyId: string };
  }>,
  reply: FastifyReply,
) => {
  const { siteId, materialId, companyId } = req.params;
  const currentUser = req.user as UserObject;

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

export const adjustMaterialQuantityController = async (
  req: FastifyRequest<{
    Params: { siteId: string; materialId: string; companyId: string };
    Body: UpdateMaterialCountDto;
  }>,
  reply: FastifyReply,
) => {
  const { siteId, materialId, companyId } = req.params;
  const data = req.body;
  const currentUser = req.user as UserObject;

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
