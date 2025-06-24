<template>
  <div v-if="user">
    <el-card
      shadow="hover"
      class="border border-gray-200 alert-bar w-full"
      data-cy="user-card"
      :body-style="{ padding: '0px' }"
    >
      <div class="p-4 flex items-start space-x-4">
        <el-avatar :src="'/placeholder.svg'" size="large" class="h-12 w-12">
          <template #default>
            {{ initials }}
          </template>
        </el-avatar>

        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center">
            <h3 class="font-medium text-gray-900 truncate">
              {{ user.firstName }} {{ user.lastName }}
            </h3>
            <div class="flex items-center space-x-2">
              <el-tag
                :type="user.status === 'ACTIVE' ? 'success' : 'info'"
                effect="light"
                size="small"
                round
              >
                {{ user.status }}
              </el-tag>

              <el-button
                size="small"
                class="btn-icon"
                data-cy="edit-user-button"
                @click="editOpen = true"
              >
                <el-icon><Edit /></el-icon>
              </el-button>

              <el-button
                size="small"
                class="btn-icon"
                data-cy="delete-user-button"
                @click="deleteOpen = true"
              >
                <el-icon><Trash2 /></el-icon>
              </el-button>
            </div>
          </div>

          <p class="text-sm text-gray-600">{{ user.role }}</p>

          <div class="info-block mt-2 text-xs text-gray-500">
            <el-icon>
              <MessageSquare />
            </el-icon>
            <span class="truncate">{{ user.email }}</span>
          </div>

          <div
            class="flex justify-between items-center mt-3 text-xs text-gray-500"
          >
            <div class="info-block">
              <el-icon>
                <Clock />
              </el-icon>
              <span>{{ 0 }} hrs this month</span>
            </div>
            <span>Joined {{ useFormatDate(user.createdAt) }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <general-confirm-action v-model="deleteOpen" @save="handleDelete" />

    <users-modals-create-update-user
      v-model="editOpen"
      :user="props.user"
      @close="editOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { Clock, Edit, MessageSquare, Trash2 } from "lucide-vue-next";
import type { UserResponseDto } from "shared";

const props = defineProps<{
  user: UserResponseDto;
}>();

const user = computed(() => props.user);
const initials = computed(
  () => `${user.value.firstName[0]}${user.value.lastName[0]}`,
);

const editOpen = ref(false);
const deleteOpen = ref(false);

const companyStore = useCompanyStore();
const companyId = useRoute().params.companyId as string;

const handleDelete = async () => {
  if (!user.value?.id) return;

  await deleteUser(companyId, user.value.id);

  await companyStore.fetchUsers(companyId);
};
</script>
