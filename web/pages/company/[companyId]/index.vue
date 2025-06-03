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
const route = useRoute();
const companyId = route.params.companyId as string;

const { sites } = useCompanySites(companyId);
const { users } = useCompanyUsers(companyId);
const { company } = useCompany(companyId);
</script>

<style scoped>
.el-tabs__header {
  border: none !important;
}
</style>
