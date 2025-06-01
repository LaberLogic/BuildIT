<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center">
    <site-basic-info :site="site" class="w-1/3 mt-1" />
    <site-tabs :site="site" class="w-1/3" />
  </div>
</template>
<script lang="ts" setup>
const site = {
  id: "1",
  name: "Greenfield Construction",
  address: "123 Main St, Springfield",
  progress: 75,
  lastVisit: "2025-05-20",
  hoursLogged: 150,
  status: "active",
  priority: "high",
  materials: { total: 100, warnings: 3 },
  chat: { unreadCount: 2, lastMessage: "Please approve the new design." },
  workers: 10,
  endDate: "2025-06-15",
  startDate: "2025-05-15",
};
</script>
