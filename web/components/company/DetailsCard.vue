<template>
  <div v-if="company">
    <el-tabs v-model="activeTab" tab-position="top" stretch class="w-full">
      <el-tab-pane name="info" label="Info" />
      <el-tab-pane name="users" label="Users" />
      <el-tab-pane name="sites" label="Sites" />
    </el-tabs>

    <div class="mt-6">
      <div v-if="activeTab === 'users'" class="space-y-4 mb-24">
        <users-user-statistics :users />
        <users-user-dashboard-actions />
        <div v-for="user in users" :key="user.id">
          <users-user-card :user="user" />
        </div>
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
          <h2 class="text-xl font-semibold">{{ props.company.name }}</h2>
          <p class="text-gray-600">
            {{ props.company.address.street }}
            {{ props.company.address.streetNumber }},
            {{ props.company.address.city }} {{ company.address.postalCode }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  CompanyResponseDto,
  SiteResponseDto,
  UserResponseDto,
} from "shared";

const props = defineProps({
  company: {
    type: Object as PropType<CompanyResponseDto>,
    required: true,
  },
  users: {
    type: Array as PropType<UserResponseDto[]>,
    required: true,
  },
  sites: {
    type: Array as PropType<SiteResponseDto[]>,
    required: true,
  },
});

const activeTab = ref("info");
</script>
