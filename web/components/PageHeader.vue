<template>
  <div class="w-1/3 px-4 mb-4">
    <el-card :body-style="{ padding: '0' }">
      <div class="px-6 py-6">
        <h1 class="text-2xl font-semibold text-gray-900">{{ props.title }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ props.description }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String as PropType<string>,
    required: true,
  },
  description: {
    type: String as PropType<string>,
    required: true,
  },
});
</script>
