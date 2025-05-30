import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateMaterialDto } from "shared";
import { CreateMaterialDto } from "shared";
import { UserObject } from "types";
import {
  createNewMaterial,
  deleteMaterialFromSite,
  incrementDecrementMaterial,
  updateMaterialProperties,
} from "../services/material.service";
import httpStatus from "http-status";
import { UpdateMaterialCountDto } from "shared";

export const createMaterialController = async (
  req: FastifyRequest<{ Params: { siteId: string }; Body: CreateMaterialDto }>,
  reply: FastifyReply,
) => {
  const { siteId } = req.params;
  const data = req.body;
  const currentUser = req.user as UserObject;

  return createNewMaterial(currentUser, siteId, data).match(
    (material) => reply.status(httpStatus.CREATED).send(material),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const updateMaterialController = async (
  req: FastifyRequest<{
    Params: { siteId: string; materialId: string };
    Body: UpdateMaterialDto;
  }>,
  reply: FastifyReply,
) => {
  const { siteId, materialId } = req.params;
  const data = req.body;
  const currentUser = req.user as UserObject;

  return updateMaterialProperties(currentUser, siteId, materialId, data).match(
    (material) => reply.status(httpStatus.OK).send(material),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const deleteMaterialController = async (
  req: FastifyRequest<{ Params: { siteId: string; materialId: string } }>,
  reply: FastifyReply,
) => {
  const { siteId, materialId } = req.params;
  const currentUser = req.user as UserObject;

  return deleteMaterialFromSite(currentUser, siteId, materialId).match(
    () => reply.status(httpStatus.NO_CONTENT).send(),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const adjustMaterialQuantityController = async (
  req: FastifyRequest<{
    Params: { siteId: string; materialId: string };
    Body: UpdateMaterialCountDto;
  }>,
  reply: FastifyReply,
) => {
  const { siteId, materialId } = req.params;
  const data = req.body;
  const currentUser = req.user as UserObject;

  return incrementDecrementMaterial(
    currentUser,
    siteId,
    materialId,
    data,
  ).match(
    (material) => reply.status(httpStatus.OK).send(material),
    (error) => sendChainedErrorReply(reply, error),
  );
};
