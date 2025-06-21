import type { CompanyResponseDto } from "shared";

const getToken = () => `Bearer ${useAuthStore().token}`;

export const useCompanies = () => {
  const config = useRuntimeConfig();

  const { data, pending, error, refresh } = useFetch<CompanyResponseDto[]>(
    () => `${config.public.API_BASE_URL}/companies/`,
    {
      headers: {
        Authorization: getToken(),
      },
    },
  );

  return {
    companies: data,
    isLoading: pending,
    error,
    refresh,
  };
};

export const useCompany = (companyId: string) => {
  const config = useRuntimeConfig();

  const { data, pending, error, refresh } = useFetch<CompanyResponseDto>(
    () => `${config.public.API_BASE_URL}/companies/${companyId}`,
    {
      headers: {
        Authorization: getToken(),
      },
    },
  );

  return {
    company: data,
    isLoading: pending,
    error,
    refresh,
  };
};
