import type { SiteResponseDto, UserResponseDto } from "shared";

import { useCompany } from "../composables/useCompany";
import {
  useCompanySiteDetails,
  useCompanySites,
  useCompanyUserSites,
} from "../composables/useSite";
import { useCompanyUsers } from "../composables/useUser";
import { useAuthStore } from "./auth";

export const useCompanyStore = defineStore("company", () => {
  const company = ref<unknown | null>(null);
  const sites = ref<SiteResponseDto[]>([]);
  const users = ref<UserResponseDto[]>([]);
  const siteDetails = ref<SiteResponseDto | null>(null);

  const authStore = useAuthStore();

  const user = computed(() => authStore.user);

  const fetchCompany = async (companyId: string) => {
    const { company: c } = useCompany(companyId);
    company.value = c;
  };

  const fetchSites = async (companyId: string) => {
    const role = user?.value?.role;

    if (!role) return;

    const isWorker = role === "WORKER";

    const { sites: s, isLoading } = isWorker
      ? useCompanyUserSites(companyId, user?.value?.id)
      : useCompanySites(companyId);

    while (isLoading.value) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    sites.value = s.value ?? [];
  };

  const fetchUsers = async (companyId: string) => {
    const role = user?.value?.role;

    if (role === "WORKER") return;

    const { users: u, isLoading } = useCompanyUsers(companyId);

    while (isLoading.value) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    users.value = u.value || [];
  };

  const fetchSiteDetails = async (companyId: string, siteId: string) => {
    const { site, isLoading } = useCompanySiteDetails(companyId, siteId);
    while (isLoading.value) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    siteDetails.value = site.value;
  };

  const fetchAll = async (companyId: string) => {
    await Promise.all([
      fetchCompany(companyId),
      fetchSites(companyId),
      fetchUsers(companyId),
    ]);
  };

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
