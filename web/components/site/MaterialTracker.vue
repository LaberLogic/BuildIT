<template>
  <el-card :body-style="{ padding: '0' }">
    <div class="p-4 space-y-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-medium text-gray-900">Materials Inventory</h3>
        <el-button
          class="h-8 text-blue-500 hover:bg-blue-50 p-1"
          @click="createOpen = true"
        >
          <el-icon> <Plus /></el-icon> Add Material
        </el-button>
      </div>
      <div v-for="material in props.materials" :key="material.unit">
        <site-material-card :material="material" />
      </div>
    </div>
    <site-modals-create-update-material v-model="createOpen" />
  </el-card>
</template>

<script lang="ts" setup>
import { Plus } from "lucide-vue-next";

const props = defineProps({
  materials: {
    type: Array as PropType<any>,
    required: true,
  },
});

const createOpen = ref(false);
</script>
