<template>
  <NuxtLink
    :to="`/company/${companyId}/sites/${site.id}`"
    class="block"
    data-cy="site-card"
  >
    <el-card
      data-cy="site-card-el"
      shadow="hover"
      class="transition-transform duration-200 hover:-translate-y-0.5 border border-gray-200"
      :body-style="{ padding: '0' }"
    >
      <div
        :class="`h-0.5 w-full ${getPriorityIndicator(site.priority)}`"
        data-cy="site-priority-bar"
      />

      <div class="p-4">
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h2
                class="font-semibold text-gray-900 text-lg truncate"
                data-cy="site-name"
              >
                {{ site.name }}
              </h2>
              <el-tag
                :type="getStatusBadge(site.status)"
                size="small"
                effect="light"
                class="capitalize"
                data-cy="site-status"
              >
                {{ site.status }}
              </el-tag>
            </div>
            <p class="text-sm text-gray-500 truncate" data-cy="site-address">
              {{ site.address }}
            </p>
          </div>
          <el-icon class="text-gray-400 ml-2" data-cy="site-arrow-icon"
            ><ArrowRight
          /></el-icon>
        </div>

        <div class="mb-4" data-cy="site-progress">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Progress</span>
            <span class="t" data-cy="site-progress-percentage">
              {{ site.progress }}%
            </span>
          </div>
          <el-progress
            :percentage="site.progress"
            :color="getProgressColor(site.progress)"
            :show-text="false"
          />
        </div>

        <div
          class="grid grid-cols-3 gap-4 mb-4 text-center"
          data-cy="site-stats"
        >
          <div data-cy="site-team-count">
            <el-icon class="mb-1 text-gray-400"><User /></el-icon>
            <p class="text-xs text-gray-500">Team</p>
            <p class="text-sm font-semibold text-gray-900">
              {{ site.assignments?.length }}
            </p>
          </div>
          <div data-cy="site-hours-logged">
            <el-icon class="mb-1 text-gray-400"><Clock /></el-icon>
            <p class="text-xs text-gray-500">Hours</p>
            <p class="text-sm font-semibold text-gray-900">
              {{ site.hoursLogged }}
            </p>
          </div>
          <div data-cy="site-deadline">
            <el-icon class="mb-1 text-gray-400"><Calendar /></el-icon>
            <p class="text-xs text-gray-500">Deadline</p>
            <p class="text-sm font-semibold text-gray-900">
              {{ formattedDeadline }}
            </p>
          </div>
        </div>

        <div
          v-if="hasWarningsOrChats"
          class="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-100"
          data-cy="site-warnings-chats"
        >
          <div
            v-if="site.materialInfo?.warnings > 0"
            class="flex items-center justify-between"
            data-cy="site-material-warning"
          >
            <div class="flex items-center text-amber-600">
              <el-icon><CircleAlert /></el-icon>
              <span class="text-sm font-medium ml-2">
                {{ site.materialInfo.warnings }} material{{
                  site.materialInfo.warnings > 1 ? "s" : ""
                }}
                low
              </span>
            </div>
            <el-tag size="small" type="warning" effect="light" class="text-xs">
              Action needed
            </el-tag>
          </div>

          <NuxtLink
            v-if="hasChat"
            :to="`/chat/site-${site.id}`"
            class="flex items-center justify-between hover:bg-gray-100 rounded-md p-2 -m-2 transition-colors"
            data-cy="site-chat-link"
            @click.stop
          >
            <div class="flex items-center text-blue-600">
              <el-icon><MessageCirclePlus /></el-icon>
              <span class="text-sm font-medium ml-2">
                {{ site.chat.unreadCount }} new message{{
                  site.chat.unreadCount > 1 ? "s" : ""
                }}
              </span>
            </div>
            <div
              class="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
              data-cy="site-unread-count"
            >
              {{ site.chat.unreadCount > 9 ? "9+" : site.chat.unreadCount }}
            </div>
          </NuxtLink>
        </div>

        <div
          class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500"
          data-cy="site-last-visited"
        >
          <span>
            Last visit:
            {{
              site.lastVisited
                ? new Date(site.lastVisited).toLocaleDateString()
                : "Never"
            }}
          </span>
          <div
            :class="`w-2 h-2 rounded-full ${getPriorityIndicator(site.priority)}`"
            :title="`${site.priority} priority`"
            data-cy="site-priority-dot"
          ></div>
        </div>
      </div>
    </el-card>
  </NuxtLink>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  Calendar,
  CircleAlert,
  Clock,
  MessageCirclePlus,
  User,
} from "lucide-vue-next";
import type { SiteResponseDto } from "shared";

const props = defineProps({
  site: {
    type: Object as PropType<SiteResponseDto>,
    required: true,
  },
});

const route = useRoute();
const companyId = computed(() => route.params.companyId);

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "INACTIVE":
      return "info";
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
  if (progress >= 80) return "#22c55e";
  if (progress >= 50) return "#3b82f6";
  if (progress >= 25) return "#facc15";
  return "#f97316";
};

const hasChat = computed(() => {
  return props.site.chat;
});

const hasWarningsOrChats = computed(() => {
  return (
    (props.site.materialInfo?.warnings ?? 0) > 0 ||
    (props.site.chat?.unreadCount ?? 0) > 0
  );
});

const formattedDeadline = computed(() => {
  return props.site.endDate
    ? new Date(props.site.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "N/A";
});
</script>
