<template>
  <div v-if="site" class="min-h-screen bg-gray-50 flex flex-col items-center">
    <site-basic-info :site="site" class="w-1/3 mt-1" />
    <site-tabs :site="site" class="w-1/3" />
  </div>
</template>
<script lang="ts" setup>
const route = useRoute();
const companyId = route.params.companyId as string;
const siteId = route.params.siteId as string;
const { site } = useCompanySiteDetails(companyId, siteId);
</script>
