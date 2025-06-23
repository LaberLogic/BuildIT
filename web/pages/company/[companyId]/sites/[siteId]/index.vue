<template>
  <div v-if="site" class="min-h-screen bg-gray-50 flex flex-col items-center">
    <site-basic-info :site="site" class="w-full md:w-1/3 max-w-[1000px] mt-1" />
    <site-tabs :site="site" class="w-full md:w-1/3 max-w-[1000px]" />
  </div>
  <div v-else class="min-h-screen flex justify-center items-center">
    Loading site details...
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});
import { useCompanyStore } from "../../../../../stores/company";

const route = useRoute();
const companyId = route.params.companyId as string;
const siteId = route.params.siteId as string;

const companyStore = useCompanyStore();

const site = computed(() => companyStore.siteDetails);

onMounted(async () => {
  await companyStore.fetchSiteDetails(companyId, siteId);
});
</script>
