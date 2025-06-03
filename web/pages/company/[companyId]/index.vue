<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center pt-4 space-y-4"
  >
    <company-details-card
      v-if="company && users?.length && sites?.length"
      :company="company"
      :users="users"
      :sites="sites"
      class="w-1/3"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  company2: {
    type: Object,
    required: true,
  },
});
const route = useRoute();
const companyId = route.params.companyId as string;

const { sites, error } = useCompanySites(companyId);
const { users, error: sth } = useCompanyUsers(companyId);
const { company, error: error3 } = useCompany(companyId);

onMounted(async () => {
  watchEffect(() => {
    if (users.value) {
      console.log("[API] Sites fetched:", users.value);
    }
    if (error.value) {
      console.error("[API] Failed to fetch sites:", error.value);
    }
  });
});
</script>

<style scoped>
.el-tabs__header {
  border: none !important;
}
</style>
