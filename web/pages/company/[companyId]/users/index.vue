<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center pt-4 space-y-4"
  >
    <users-user-statistics class="w-1/3" />
    <users-user-dashboard-actions class="w-1/3" />
    <div v-for="user in users" :key="user.id" class="w-1/3">
      <users-user-card :user="user" />
    </div>
  </div>
</template>
<script lang="ts" setup>
const route = useRoute();
const companyId = route.params.companyId as string;

const users = [
  {
    firstName: "Jane",
    lastName: "Doe",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    email: "jane.doe@example.com",
    role: "Project Manager",
    status: "active",
    currentSite: "Site Alpha - Berlin",
    hoursThisMonth: 128,
    joinDate: "March 15, 2023",
  },
];

onMounted(async () => {
  const { users, error } = useCompanyUsers(companyId);

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
