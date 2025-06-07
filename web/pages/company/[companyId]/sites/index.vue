<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center pt-4 space-y-4"
  >
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Sites</h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ sites.length }} active projects
        </p>
      </div>

      <el-button
        type="default"
        circle
        class="h-12 w-12 bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
        @click="editOpen = true"
      >
        <Plus class="h-6 w-6 text-blue-500" />
        <span class="sr-only">Add new site</span>
      </el-button>
      <site-modals-update-site
        v-model="editOpen"
        :users="users"
        @create="handleCreate"
      />
    </div>
    <div class="w-1/3 space-y-4 pb-4 mb-28">
      <div
        v-for="(site, index) in sites"
        :key="site.id"
        class="animate-in slide-in-from-bottom-4 duration-300"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <site-card :site="site" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import type { CreateSiteDto } from "shared";

import { useCompanyStore } from "../../../../stores/company";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const companyId = route.params.companyId as string;
const sites = computed(() => companyStore.sites);
const users = computed(() => companyStore.users);
const companyStore = useCompanyStore();

const editOpen = ref(false);

const handleCreate = async (payload: CreateSiteDto) => {
  const createdSite = await createSite({ companyId }, payload);

  if (createdSite) {
    editOpen.value = false;
    await companyStore.fetchSites(companyId);
  } else {
    console.error("Failed to update site");
  }
};

onMounted(async () => {
  await companyStore.fetchSites(companyId);
  await companyStore.fetchUsers(companyId);
});
</script>
