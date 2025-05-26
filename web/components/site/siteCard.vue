<template>
  <NuxtLink :to="`/sites/${site.id}`" class="block">
    <el-card
      shadow="hover"
      class="transition-transform duration-200 hover:-translate-y-0.5 border border-gray-200"
      :body-style="{ padding: '0' }"
    >
      <!-- Priority indicator -->
      <div :class="`h-0.5 w-full ${getPriorityIndicator(site.priority)}`" />

      <div class="p-4">
        <!-- Header -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h2 class="font-semibold text-gray-900 text-lg truncate">
                {{ site.name }}
              </h2>
              <el-tag
                :type="getStatusBadge(site.status)"
                size="small"
                effect="light"
                class="capitalize"
              >
                {{ site.status }}
              </el-tag>
            </div>
            <p class="text-sm text-gray-500 truncate">{{ site.address }}</p>
          </div>
          <el-icon class="text-gray-400 ml-2"><ArrowRight /></el-icon>
        </div>

        <!-- Progress -->
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Progress</span>
            <span class="text-sm font-semibold text-gray-900">
              {{ site.progress }}%
            </span>
          </div>
          <el-progress
            :percentage="site.progress"
            :status="getProgressStatus(site.progress)"
            :color="getProgressColor(site.progress)"
            :stroke-width="10"
            show-text="false"
          />
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <el-icon class="mb-1 text-gray-400"><User /></el-icon>
            <p class="text-xs text-gray-500">Team</p>
            <p class="text-sm font-semibold text-gray-900">
              {{ site.teamSize }}
            </p>
          </div>
          <div>
            <el-icon class="mb-1 text-gray-400"><Clock /></el-icon>
            <p class="text-xs text-gray-500">Hours</p>
            <p class="text-sm font-semibold text-gray-900">
              {{ site.hoursLogged }}
            </p>
          </div>
          <div>
            <el-icon class="mb-1 text-gray-400"><Calendar /></el-icon>
            <p class="text-xs text-gray-500">Deadline</p>
            <p class="text-sm font-semibold text-gray-900">
              {{
                new Date(site.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            </p>
          </div>
        </div>

        <!-- Alerts Section -->
        <div
          v-if="hasWarningsOrChats"
          class="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-100"
        >
          <div
            v-if="site.materials?.warnings > 0"
            class="flex items-center justify-between"
          >
            <div class="flex items-center text-amber-600">
              <el-icon><WarningFilled /></el-icon>
              <span class="text-sm font-medium ml-2">
                {{ site.materials.warnings }} material{{
                  site.materials.warnings > 1 ? "s" : ""
                }}
                low
              </span>
            </div>
            <el-tag size="small" type="warning" effect="light" class="text-xs">
              Action needed
            </el-tag>
          </div>

          <NuxtLink
            v-if="site.chat?.unreadCount > 0"
            :to="`/chat/site-${site.id}`"
            class="flex items-center justify-between hover:bg-gray-100 rounded-md p-2 -m-2 transition-colors"
            @click.stop
          >
            <div class="flex items-center text-blue-600">
              <el-icon><ChatDotRound /></el-icon>
              <span class="text-sm font-medium ml-2">
                {{ site.chat.unreadCount }} new message{{
                  site.chat.unreadCount > 1 ? "s" : ""
                }}
              </span>
            </div>
            <div
              class="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
            >
              {{ site.chat.unreadCount > 9 ? "9+" : site.chat.unreadCount }}
            </div>
          </NuxtLink>
        </div>

        <!-- Footer -->
        <div
          class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500"
        >
          <span>Last visit: {{ site.lastVisit }}</span>
          <div
            :class="`w-2 h-2 rounded-full ${getPriorityColor(site.priority)}`"
            :title="`${site.priority} priority`"
          ></div>
        </div>
      </div>
    </el-card>
  </NuxtLink>
</template>

<script setup lang="ts">
import {
  User,
  Clock,
  Calendar,
  WarningFilled,
  ChatDotRound,
} from "@element-plus/icons-vue";

interface Site {
  id: string;
  name: string;
  address: string;
  progress: number;
  lastVisit: string;
  hoursLogged: number;
  status: "active" | "planning" | "finishing" | "paused";
  priority: "high" | "medium" | "low";
  materials?: {
    total: number;
    warnings: number;
  };
  chat?: {
    unreadCount: number;
    lastMessage?: string;
  };
  teamSize: number;
  deadline: string;
}

const props = defineProps<{ site: Site }>();

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "planning":
      return "bg-gray-100 text-gray-600 border-gray-200";
    case "finishing":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "paused":
      return "bg-gray-100 text-gray-500 border-gray-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const getPriorityIndicator = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-orange-400";
    case "low":
      return "bg-gray-300";
    default:
      return "bg-gray-300";
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "#22c55e"; // green-500
  if (progress >= 50) return "#3b82f6"; // blue-500
  if (progress >= 25) return "#facc15"; // yellow-500
  return "#f97316"; // orange-500
};

const getProgressStatus = (progress: number) => {
  if (progress >= 80) return "success";
  if (progress >= 50) return "primary";
  if (progress >= 25) return "warning";
  return "exception";
};

const hasWarningsOrChats = computed(() => {
  return (
    (props.site.materials?.warnings ?? 0) > 0 ||
    (props.site.chat?.unreadCount ?? 0) > 0
  );
});
</script>
