<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center pt-4 space-y-4"
  >
    <users-user-statistics class="w-1/3" :users="users || []" />
    <users-user-dashboard-actions class="w-1/3" />
    <div class="w-1/3 space-y-4 pb-4">
      <div v-for="user in users" :key="user.id">
        <users-user-card :user="user" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCompanyStore } from "../../../../stores/company";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const companyId = route.params.companyId as string;

const companyStore = useCompanyStore();

const users = computed(() => companyStore.users);

onMounted(async () => {
  await companyStore.fetchUsers(companyId);
});
</script>
