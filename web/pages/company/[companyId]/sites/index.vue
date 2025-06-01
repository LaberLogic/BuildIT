<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center pt-4 space-y-4"
  >
    <div class="w-1/3 space-y-4 pb-4 mb-28">
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
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const companyId = route.params.companyId as string;
const sites = [
  {
    id: "cmbdjbnr5000azuyls58rtcti",
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

onMounted(async () => {
  const { sites: fetchedSites, error } = useCompanySites(companyId);

  watchEffect(() => {
    if (fetchedSites.value) {
      console.log("[API] Sites fetched:", fetchedSites.value);
    }
    if (error.value) {
      console.error("[API] Failed to fetch sites:", error.value);
    }
  });
});
</script>
