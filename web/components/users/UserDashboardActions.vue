<template>
  <div class="p-4">
    <el-input placeholder="Search by name" />

    <div class="flex gap-3 mt-4">
      <el-select
        v-model="roleFilter"
        placeholder="Filter by role"
        class="flex-border border-gray-200 rounded"
      >
        <el-option label="All Roles" value="all" />
        <el-option label="Manager" value="manager" />
        <el-option label="Foreman" value="foreman" />
        <el-option label="Inspector" value="inspector" />
        <el-option label="Electrician" value="electrician" />
      </el-select>

      <el-button
        type="primary"
        data-cy="create-user-button"
        @click="onAddClick"
      >
        <el-icon><Plus /></el-icon>
      </el-button>

      <users-modals-create-update-user
        v-model="createOpen"
        @close="createOpen = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";

const createOpen = ref(false);
const roleFilter = ref("all");

const onAddClick = () => {
  createOpen.value = true;
};
</script>
