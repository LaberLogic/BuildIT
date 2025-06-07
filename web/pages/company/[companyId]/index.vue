<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center pt-4 space-y-4"
  >
    <company-details-card
      v-if="company && users.length && sites.length"
      :company="company"
      :users="users"
      :sites="sites"
      class="w-1/3"
    />
  </div>
</template>

<script setup lang="ts">
import { useCompanyStore } from "../../../stores/company";

const route = useRoute();
const companyId = route.params.companyId as string;

const companyStore = useCompanyStore();

const company = computed(() => companyStore.company);
const sites = computed(() => companyStore.sites);
const users = computed(() => companyStore.users);

onMounted(async () => {
  await companyStore.fetchAll(companyId);
});
</script>

<style scoped>
.el-tabs__header {
  border: none !important;
}
</style>
