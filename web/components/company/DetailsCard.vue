<template>
  <div>
    <el-tabs
      v-model="activeTab"
      type="card rounded-lg"
      tab-position="top"
      stretch
      class="w-full"
    >
      <el-tab-pane name="info" label="Info" />
      <el-tab-pane name="users" label="Users" />
      <el-tab-pane name="sites" label="Sites" />
    </el-tabs>

    <div class="mt-6">
      <div v-if="activeTab === 'users'" class="space-y-4">
        <users-user-statistics />
        <users-user-dashboard-actions />
        <users-user-card :user="user" />
      </div>

      <div v-else-if="activeTab === 'sites'" class="space-y-4 pb-4 mb-24">
        <div
          v-for="(site, index) in sites"
          :key="site.id"
          class="animate-in slide-in-from-bottom-4 duration-300"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <site-card :site="site" />
        </div>
      </div>

      <div v-else-if="activeTab === 'info'">
        <div class="bg-white shadow rounded-xl p-6 space-y-2">
          <h2 class="text-xl font-semibold">{{ company.name }}</h2>
          <p class="text-gray-600">
            {{ company.address.street }} {{ company.address.streetNumber }},
            {{ company.address.city }} {{ company.address.postCode }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { defineProps } from "vue";

const props = defineProps({
  company2: {
    type: Object,
    required: true,
  },
});

const activeTab = ref("info");

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

<style scoped>
.el-tabs__header {
  border: none !important;
}
</style>
