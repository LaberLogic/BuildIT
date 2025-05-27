<template>
  <el-card class="box-card mb-6" shadow="hover" v-if="user.value">
    <div class="text-center p-6">
      <el-avatar :src="avatarSrc" size="large" class="mx-auto mb-4">
        {{ userInitials }}
      </el-avatar>

      <h1 class="text-xl font-semibold text-gray-900">{{ fullName }}</h1>
      <p class="text-gray-600 mt-1">{{ user.value.role }}</p>
      <p class="text-sm text-gray-500 mt-1">{{ companyName }}</p>

      <el-button type="primary" plain class="mt-4"> Edit Profile </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

const { user } = useAuth();

const avatarSrc = computed(() => user.value?.avatar ?? "/placeholder.svg");

const fullName = computed(() =>
  user.value ? `${user.value.firstName} ${user.value.lastName}` : "",
);

const userInitials = computed(() =>
  `${user.value?.firstName?.[0] ?? ""}${user.value?.lastName?.[0] ?? ""}`.toUpperCase(),
);

const companyName = computed(
  () => user.value?.company ?? "Company not specified",
);
</script>
