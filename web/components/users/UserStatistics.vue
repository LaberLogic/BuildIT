<template>
  <div class="grid grid-cols-3 gap-4 p-4">
    <el-card
      class="text-center border border-gray-200"
      shadow="hover"
      :body-style="{ padding: '12px' }"
    >
      <p class="text-lg font-semibold text-gray-900">{{ "5" }}</p>
      <p class="text-xs text-gray-500 mt-1">{{ "Total Users" }}</p>
    </el-card>

    <el-card
      class="text-center border border-gray-200"
      shadow="hover"
      :body-style="{ padding: '12px' }"
    >
      <p class="text-lg font-semibold text-gray-900">{{ "5" }}</p>
      <p class="text-xs text-gray-500 mt-1">{{ "Active Users" }}</p>
    </el-card>

    <el-card
      class="text-center border border-gray-200"
      shadow="hover"
      :body-style="{ padding: '12px' }"
    >
      <p class="text-lg font-semibold text-gray-900">{{ "5" }}</p>
      <p class="text-xs text-gray-500 mt-1">{{ "On Site" }}</p>
    </el-card>
  </div>
</template>

<script lang="ts" setup></script>
