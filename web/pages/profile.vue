<template>
  <div class="flex flex-col items-center gap-6 mt-10">
    <el-card
      class="w-96 border shadow-sm rounded-2xl transition-transform duration-200 hover:-translate-y-0.5 border border-gray-200"
    >
      <div class="text-center p-6">
        <el-avatar :src="avatarSrc" size="large" class="mx-auto mb-4">
          {{ userInitials }}
        </el-avatar>

        <h1 class="text-xl font-semibold text-gray-900">{{ fullName }}</h1>
        <p class="text-gray-600 mt-1 capitalize">
          {{ user?.role.toLowerCase() }}
        </p>
        <p class="text-sm text-gray-500 mt-1">{{ companyName }}</p>

        <el-button
          type="primary"
          plain
          class="mt-4 border-blue-500 text-blue-500 hover:bg-blue-50"
          @click="editOpen = true"
        >
          Edit Profile
        </el-button>
      </div>
    </el-card>

    <el-card
      class="w-96 border shadow-sm rounded-2xl transition-transform duration-200 hover:-translate-y-0.5 border border-gray-200"
    >
      <div class="p-6 space-y-4">
        <h3 class="font-medium text-gray-900 mb-2">Contact Information</h3>

        <div class="flex items-center">
          <el-icon class="mr-3 text-gray-500">
            <Message />
          </el-icon>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ user?.email }}</p>
            <p class="text-xs text-gray-500">Email</p>
          </div>
        </div>

        <div class="flex items-center">
          <el-icon class="mr-3 text-gray-500">
            <Calendar />
          </el-icon>
          <div>
            <p class="text-sm font-medium text-gray-900">
              {{ formatDate(user?.createdAt) }}
            </p>
            <p class="text-xs text-gray-500">Member since</p>
          </div>
        </div>
      </div>
    </el-card>

    <users-update-profile-modal
      v-model="editOpen"
      :userData="user"
      @save="handleUserUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Message, Calendar } from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const user = computed(() => auth.user);

const editOpen = ref(false);

const avatarSrc = computed(() => "/placeholder.svg");

const fullName = computed(() =>
  user.value ? `${user.value.firstName} ${user.value.lastName}` : "",
);

const userInitials = computed(() =>
  `${user.value?.firstName?.[0] ?? ""}${user.value?.lastName?.[0] ?? ""}`.toUpperCase(),
);

const companyName = computed(
  () => user.value?.companyId || "Company not specified",
);

const formatDate = (date?: string | Date | null) =>
  date ? new Date(date).toLocaleDateString() : "";

async function handleUserUpdate(updatedUser: UpdateUserDto) {
  console.log("User updated:", updatedUser);
  editOpen.value = false;
}
</script>
