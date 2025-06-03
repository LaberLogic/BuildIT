<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center pt-4 space-y-4"
  >
    <users-user-statistics class="w-1/3" :users="users" />
    <users-user-dashboard-actions class="w-1/3" />
    <div v-for="user in users" :key="user.id" class="w-1/3">
      <users-user-card :user="user" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const companyId = route.params.companyId as string;
const { users, error } = useCompanyUsers(companyId);
</script>
