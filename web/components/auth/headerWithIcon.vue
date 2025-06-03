<template>
  <div class="text-center mb-5">
    <div
      class="w-20 h-20 bg-blue-500 rounded-2xl flex mx-auto mb-4 items-center justify-center"
    >
      <div class="text-white text-3xl">
        <el-icon>
          <OfficeBuilding />
        </el-icon>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-gray-900">{{ props.title }}</h1>
    <p class="text-gray-500 mt-2">{{ props.subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import { OfficeBuilding } from "@element-plus/icons-vue";

const props = defineProps({
  title: {
    type: String as PropType<string>,
    required: true,
  },
  subtitle: {
    type: String as PropType<string>,
    required: true,
  },
});
</script>
