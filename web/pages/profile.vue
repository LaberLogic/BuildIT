<template>
  <el-card class="box-card mb-6" shadow="hover">
    <div class="text-center p-6">
      <el-avatar :src="avatarSrc" size="large" class="mx-auto mb-4">
        {{ userInitials }}
      </el-avatar>

      <h1 class="text-xl font-semibold text-gray-900">{{ fullName }}</h1>
      <p class="text-gray-600 mt-1">{{ user.role }}</p>
      <p class="text-sm text-gray-500 mt-1">{{ companyName }}</p>

      <el-button type="primary" plain class="mt-4"> Edit Profile </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const user = computed(() => authStore.user);

console.log(user.value);

const avatarSrc = computed(() => user.value?.avatar || "/placeholder.svg");

const fullName = computed(() => {
  const u = user.value;
  if (!u) return "";
  return `${u.firstName || ""} ${u.lastName || ""}`.trim();
});

const userInitials = computed(() => {
  const u = user.value;
  if (!u) return "";
  const firstInitial = u.firstName?.[0] ?? "";
  const lastInitial = u.lastName?.[0] ?? "";
  return (firstInitial + lastInitial).toUpperCase();
});

const companyName = computed(
  () => user.value?.company || "Company not specified",
);
</script>
