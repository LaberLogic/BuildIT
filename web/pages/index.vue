<template>
  <app-header class="h-16" />
  <div class="flex justify-center">
    <div class="w-1/3 space-y-4 pb-4">
      <div
        v-for="(site, index) in sites"
        :key="site.id"
        class="animate-in slide-in-from-bottom-4 duration-300"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <site-card :site="site" />
      </div>
    </div>
  </div>
  <app-footer class="h-20" />
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
const sites = [
  {
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
    teamSize: 10,
    deadline: "2025-06-15",
  },
  {
    id: "2",
    name: "Lakeside Renovation",
    address: "456 Lake Dr, Rivertown",
    progress: 40,
    lastVisit: "2025-05-18",
    hoursLogged: 80,
    status: "planning",
    priority: "medium",
    materials: { total: 50, warnings: 0 },
    chat: { unreadCount: 0 },
    teamSize: 5,
    deadline: "2025-07-01",
  },
  {
    id: "3",
    name: "Downtown Tower",
    address: "789 City Rd, Metropolis",
    progress: 90,
    lastVisit: "2025-05-22",
    hoursLogged: 300,
    status: "finishing",
    priority: "high",
    materials: { total: 200, warnings: 1 },
    chat: { unreadCount: 5, lastMessage: "Urgent material order needed." },
    teamSize: 25,
    deadline: "2025-06-05",
  },
  {
    id: "4",
    name: "Suburban Homes",
    address: "321 Oak St, Pleasantville",
    progress: 20,
    lastVisit: "2025-05-10",
    hoursLogged: 40,
    status: "paused",
    priority: "low",
    materials: { total: 70, warnings: 0 },
    chat: { unreadCount: 0 },
    teamSize: 8,
    deadline: "2025-08-20",
  },
];

const authStore = useAuthStore();

const user = computed(() => authStore.user().value);
console.log(user);
</script>
