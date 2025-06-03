export const useCompanySites = (companyId: string) => {
  const authStore = useAuthStore();

  const { data, pending, error, refresh } = useFetch(
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

  const { data, pending, error, refresh } = useFetch(
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
