<template>
  <div class="grid grid-cols-3 gap-4 p-4">
    <el-card
      class="text-center border border-gray-200"
      shadow="hover"
      :body-style="{ padding: '12px' }"
    >
      <p class="text-lg font-semibold text-gray-900">{{ totalUsers }}</p>
      <p class="text-xs text-gray-500 mt-1">{{ "Total Users" }}</p>
    </el-card>

    <el-card
      class="text-center border border-gray-200"
      shadow="hover"
      :body-style="{ padding: '12px' }"
    >
      <p class="text-lg font-semibold text-gray-900">{{ activeUsers }}</p>
      <p class="text-xs text-gray-500 mt-1">{{ "Active Users" }}</p>
    </el-card>

    <el-card
      class="text-center border border-gray-200"
      shadow="hover"
      :body-style="{ padding: '12px' }"
    >
      <p class="text-lg font-semibold text-gray-900">{{ onSiteUsers }}</p>
      <p class="text-xs text-gray-500 mt-1">{{ "On Site" }}</p>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

const props = defineProps({
  users: {
    type: Array as PropType<any>,
  },
});

const activeUsers = computed(() => {
  return props?.users?.filter((user) => user?.status === "ACTIVE").length;
});

const onSiteUsers = computed(() => {
  return props?.users?.filter((user) => user?.status === "on_site").length;
});

const totalUsers = computed(() => {
  return props?.users?.length;
});
</script>
