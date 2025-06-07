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

      <el-button type="primary" @click="onAddClick">
        <el-icon><Plus /></el-icon>
      </el-button>

      <users-modals-create-update-user
        v-model="createOpen"
        @save="handleCreateUser"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import type { CreateUserDto } from "shared";

import { createUser } from "../../composables/useUser";
const route = useRoute();

const companyId = route.params.companyId as string;
const companyStore = useCompanyStore();

const createOpen = ref(false);
const roleFilter = ref("all");

const onAddClick = () => {
  createOpen.value = true;
};

const handleCreateUser = async (payload: CreateUserDto) => {
  try {
    const created = await createUser(companyId, payload);

    if (created) {
      createOpen.value = false;
      companyStore.fetchUsers(companyId);
    } else {
      console.error("Failed to create user");
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
};
</script>
