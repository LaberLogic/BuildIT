<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center pt-4 space-y-4"
  >
    <users-user-statistics class="w-1/3" />
    <users-user-dashboard-actions class="w-1/3" />
    <users-user-card :user="user" class="w-1/3" />
  </div>
</template>
<script lang="ts" setup>
const user = {
  firstName: "Jane",
  lastName: "Doe",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  email: "jane.doe@example.com",
  role: "Project Manager",
  status: "active",
  currentSite: "Site Alpha - Berlin",
  hoursThisMonth: 128,
  joinDate: "March 15, 2023",
};
</script>
