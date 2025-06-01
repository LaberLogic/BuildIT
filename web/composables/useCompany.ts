const getToken = () => `Bearer ${useAuthStore().token}`;

export const useCompanies = () => {
  const { data, pending, error, refresh } = useFetch<[]>(
    () => `/api/companies/`,
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
  const { data, pending, error, refresh } = useFetch(
    () => `/api/companies/${companyId}`,
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
