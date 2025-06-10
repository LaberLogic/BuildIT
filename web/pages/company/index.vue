<template>
  <div class="flex justify-center mt-4 overflow-scroll">
    <div class="w-1/3 space-y-4 pb-4 mb-24">
      <div
        v-for="(company, index) in companies"
        :key="company.id"
        class="animate-in slide-in-from-bottom-4 duration-300"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <company-overview-card :company="company" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const companyStore = useCompanyStore();

const companies = computed(() => {
  return companyStore.companies;
});

onMounted(async () => {
  await companyStore.fetchCompanies();
  console.log(companyStore);
});
</script>
