import { MaterialResponseDto } from "shared";

import { Material } from "../repositories/material.repostiory";

export const toMaterialDTO = (material: Material): MaterialResponseDto => {
  return {
    id: material.id,
    name: material.name,
    amount: material.amount,
    threshold: material.threshold,
    unit: material.unit,
  };
};
