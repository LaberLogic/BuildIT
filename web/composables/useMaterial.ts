import type {
  CreateMaterialDto,
  MaterialResponseDto,
  UpdateMaterialDto,
} from "shared";

export const incrementDecrementMaterial = async ({
  companyId,
  siteId,
  materialId,
  delta,
}: {
  companyId: string;
  siteId: string;
  materialId: string;
  delta: number;
}) => {
  const authStore = useAuthStore();

  try {
    const response = await $fetch<MaterialResponseDto>(
      `/api/companies/${companyId}/sites/${siteId}/materials/${materialId}/adjust-quantity`,
      {
        method: "POST",
        body: { delta },
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    );

    return response;
  } catch (err) {
    console.error("Error adjusting quantity", err);
    throw err;
  }
};

export const createMaterial = async ({
  companyId,
  siteId,
  payload,
}: {
  companyId: string;
  siteId: string;
  payload: CreateMaterialDto;
}): Promise<MaterialResponseDto> => {
  const authStore = useAuthStore();

  try {
    const response = await $fetch<MaterialResponseDto>(
      `/api/companies/${companyId}/sites/${siteId}/materials/`,
      {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    );

    return response;
  } catch (err) {
    console.error("Error creating material", err);
    throw err;
  }
};

export const updateMaterial = async ({
  companyId,
  siteId,
  materialId,
  payload,
}: {
  companyId: string;
  siteId: string;
  materialId: string;
  payload: UpdateMaterialDto;
}): Promise<MaterialResponseDto> => {
  const authStore = useAuthStore();

  try {
    const response = await $fetch<MaterialResponseDto>(
      `/api/companies/${companyId}/sites/${siteId}/materials/${materialId}`,
      {
        method: "PATCH",
        body: payload,
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    );

    return response;
  } catch (err) {
    console.error("Error updating material", err);
    throw err;
  }
};
