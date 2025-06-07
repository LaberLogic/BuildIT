import type {
  MaterialIdWithSiteParams,
  MaterialResponseDto,
  UpdateMaterialCountDto,
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
