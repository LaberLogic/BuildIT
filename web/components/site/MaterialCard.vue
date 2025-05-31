<template>
  <div
    class="border border-gray-200 rounded-md"
    :body-style="{ padding: '16px' }"
  >
    <div
      class="flex items-center justify-between p-3 border border-gray-200 rounded-md"
    >
      <div class="flex-1">
        <div class="flex items-center">
          <span class="text-label">{{ material.name }}</span>
          <el-tag
            :type="getStatusBadge()"
            size="small"
            effect="light"
            class="capitalize ml-1"
          >
            {{ getStatusName() }}
          </el-tag>
        </div>
        <div class="text-sm text-gray-500 mt-1">
          Threshold: {{ material.threshold }}
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <el-button class="btn-icon">
          <el-icon>
            <Plus />
          </el-icon>
        </el-button>
        <span class="mx-2 min-w-[40px] text-center">
          {{ material.quantity }} {{ material.unit }}
        </span>
        <el-button class="btn-icon">
          <el-icon>
            <Minus />
          </el-icon>
        </el-button>
      </div>

      <el-button class="btn-icon ml-4" @click="editOpen = true">
        <el-icon>
          <Edit />
        </el-icon>
      </el-button>
      <el-button class="btn-icon" @click="deleteOpen = true">
        <el-icon>
          <Trash />
        </el-icon>
      </el-button>
    </div>
    <site-modals-create-update-material
      v-model="editOpen"
      :material="material"
    />
    <general-confirm-action v-model="deleteOpen" :material="material" />
  </div>
</template>

<script setup lang="ts">
import { Plus, Minus, Trash, Edit } from "lucide-vue-next";

const editOpen = ref(false);
const deleteOpen = ref(false);
const material = ref({
  id: 1,
  name: "Material 1",
  unit: "Unit",
  threshold: 10,
  quantity: 5,
});

const getStatusBadge = (): "warning" | "success" | "info" | "danger" => {
  if (material.value.quantity === 0) return "danger";
  if (material.value.quantity <= material.value.threshold) return "warning";
  return "info";
};

const getStatusName = (): string => {
  if (material.value.quantity === 0) return "Out of Stock";
  if (material.value.quantity <= material.value.threshold) return "Low Stock";
  return "In Stock";
};
</script>
