import type {
  CompanyIdParams,
  CreateSiteDto,
  SiteIdParams,
  SiteResponseDto,
  UpdateSiteDto,
} from "shared";

export const useCompanySites = (companyId: string) => {
  const authStore = useAuthStore();

  const { data, pending, error, refresh } = useFetch<SiteResponseDto[]>(
    () => `/api/companies/${companyId}/sites`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  );

  return {
    sites: data,
    isLoading: pending,
    error,
    refresh,
  };
};

export const useCompanySiteDetails = (companyId: string, siteId: string) => {
  const authStore = useAuthStore();

  const { data, pending, error, refresh } = useFetch<SiteResponseDto>(
    () => `/api/companies/${companyId}/sites/${siteId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  );

  return {
    site: data,
    isLoading: pending,
    error,
    refresh,
  };
};

export const updateSite = async (
  params: SiteIdParams,
  body: UpdateSiteDto,
): Promise<SiteResponseDto | null> => {
  try {
    const { companyId, siteId } = params;
    const authStore = useAuthStore();
    const result = await $fetch<SiteResponseDto>(
      `/api/companies/${companyId}/sites/${siteId}`,
      {
        method: "PATCH",
        body,
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    );

    return result;
  } catch (error) {
    console.error("Failed to update site:", error);
    return null;
  }
};

export const createSite = async (
  params: CompanyIdParams,
  body: CreateSiteDto,
): Promise<SiteResponseDto | null> => {
  try {
    const { companyId } = params;
    const authStore = useAuthStore();
    const result = await $fetch<SiteResponseDto>(
      `/api/companies/${companyId}/sites/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
        body,
      },
    );

    return result;
  } catch (error) {
    console.error("Failed to update site:", error);
    return null;
  }
};
