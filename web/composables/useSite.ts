import type {
  CompanyIdParams,
  CreateSiteDto,
  SiteIdParams,
  SiteResponseDto,
  UpdateSiteDto,
} from "shared";

export const useCompanySites = (companyId: string) => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  const { data, pending, error, refresh } = useFetch<SiteResponseDto[]>(
    () => `${config.public.API_BASE_URL}/companies/${companyId}/sites`,
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

export const useCompanyUserSites = (companyId: string, userId: string) => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  const { data, pending, error, refresh } = useFetch<SiteResponseDto[]>(
    () =>
      `${config.public.API_BASE_URL}/companies/${companyId}/sites/user/${userId}`,
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
  const config = useRuntimeConfig();

  const { data, pending, error, refresh } = useFetch<SiteResponseDto>(
    () =>
      `${config.public.API_BASE_URL}/companies/${companyId}/sites/${siteId}`,
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
): Promise<SiteResponseDto> => {
  const { companyId, siteId } = params;
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  return await $fetch<SiteResponseDto>(
    `${config.public.API_BASE_URL}/companies/${companyId}/sites/${siteId}`,
    {
      method: "PATCH",
      body,
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  );
};

export const createSite = async (
  params: CompanyIdParams,
  body: CreateSiteDto,
): Promise<SiteResponseDto> => {
  const { companyId } = params;
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  return await $fetch<SiteResponseDto>(
    `${config.public.API_BASE_URL}/companies/${companyId}/sites/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      body,
    },
  );
};
