<template>
  <el-card
    class="border border-gray-200 hover:shadow-md transition-shadow duration-200 w-full max-w-md"
    shadow="never"
  >
    <div class="p-4 flex items-start space-x-3">
      <el-avatar
        :src="user.avatar || '/placeholder.svg'"
        size="large"
        class="h-12 w-12"
      >
        <template #default>
          {{ initials }}
        </template>
      </el-avatar>

      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h3 class="font-medium text-gray-900 truncate">{{ user.name }}</h3>
          <span
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            :class="
              user.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            "
          >
            {{ user.status }}
          </span>
        </div>

        <!-- Role -->
        <p class="text-sm text-gray-600 mt-1">{{ user.role }}</p>

        <!-- Email -->
        <div class="flex items-center mt-2 text-xs text-gray-500">
          <el-icon class="mr-1"><Message /></el-icon>
          <span class="truncate">{{ user.email }}</span>
        </div>

        <!-- Current Site -->
        <div
          v-if="user.currentSite"
          class="flex items-center mt-1 text-xs text-gray-500"
        >
          <el-icon class="mr-1"><Location /></el-icon>
          <span class="truncate">{{ user.currentSite }}</span>
        </div>

        <!-- Footer Info -->
        <div class="flex items-center justify-between mt-3 text-xs">
          <div class="flex items-center text-gray-500">
            <el-icon class="mr-1"><Timer /></el-icon>
            <span>{{ user.hoursThisMonth }} hrs this month</span>
          </div>
          <span class="text-gray-500">Joined {{ user.joinDate }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Message, Location, Timer } from "@element-plus/icons-vue";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    status: "active" | "inactive";
    currentSite: string | null;
    joinDate: string;
    hoursThisMonth: number;
  };
}

const props = defineProps<UserCardProps>();

const initials = computed(() => {
  return props.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
});
</script>
