<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center pt-4 space-y-4"
  >
    <company-details-card
      :company2="company"
      :users="users"
      sites2="sites"
      class="w-1/3"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { defineProps } from "vue";

const props = defineProps({
  company2: {
    type: Object,
    required: true,
  },
});

const activeTab = ref("overview");

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

const company = {
  id: "5",
  name: "Test Company",
  address: {
    street: "123 Main St",
    city: "Springfield",
    streetNumber: "123",
    postCode: "62701",
  },
  sites,
};

const route = useRoute();
const companyId = route.params.companyId;

onMounted(async () => {
  const { users, error } = useCompanyUsers(companyId);
  const { sites: sites2, error: error2 } = useCompanySites(companyId);
  const { company: company3, error: error3 } = useCompany(companyId);
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

<style scoped>
.el-tabs__header {
  border: none !important;
}
</style>
