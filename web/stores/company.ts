import type { SiteResponseDto, UserResponseDto } from "shared";

import { useCompany } from "../composables/useCompany";
import { useCompanySiteDetails, useCompanySites } from "../composables/useSite";
import { useCompanyUsers } from "../composables/useUser";

export const useCompanyStore = defineStore("company", () => {
  const company: Ref<any | null> = ref(null);
  const sites: Ref<SiteResponseDto[]> = ref([]);
  const users: Ref<UserResponseDto[]> = ref([]);
  const siteDetails: Ref<SiteResponseDto | null> = ref(null);

  async function fetchCompany(companyId: string) {
    const { company: c } = useCompany(companyId);
    company.value = c;
  }

  async function fetchSites(companyId: string) {
    const { sites: s, isLoading } = useCompanySites(companyId);

    while (isLoading.value) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    sites.value = s.value ?? [];
  }

  async function fetchUsers(companyId: string) {
    const { users: u, isLoading } = useCompanyUsers(companyId);
    while (isLoading.value) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    users.value = u.value || [];
  }

  async function fetchSiteDetails(companyId: string, siteId: string) {
    const { site, isLoading } = useCompanySiteDetails(companyId, siteId);
    while (isLoading.value) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    siteDetails.value = site.value;
  }

  async function fetchAll(companyId: string) {
    await Promise.all([
      fetchCompany(companyId),
      fetchSites(companyId),
      fetchUsers(companyId),
    ]);
  }

  return {
    company,
    sites,
    users,
    siteDetails,
    fetchCompany,
    fetchSites,
    fetchUsers,
    fetchSiteDetails,
    fetchAll,
  };
});
