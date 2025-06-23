<template>
  <el-card :body-style="{ padding: '0' }" data-cy="material-tracker">
    <div class="p-4 space-y-4">
      <div
        class="flex justify-between items-center mb-4"
        data-cy="material-header"
      >
        <h3 class="font-medium text-gray-900">Materials Inventory</h3>
        <el-button
          v-if="isAdminOrManager"
          class="h-8 text-blue-500 hover:bg-blue-50 p-1"
          data-cy="add-material-button"
          @click="createOpen = true"
        >
          <el-icon><Plus /></el-icon> Add Material
        </el-button>
      </div>
      <div
        v-for="material in props.materials"
        :key="material.unit"
        data-cy="material-card"
      >
        <site-material-card :material="material" />
      </div>
    </div>

    <site-modals-create-update-material
      v-if="isAdminOrManager"
      v-model="createOpen"
      @save="handleCreateMaterial"
      @close="createOpen = false"
    />
  </el-card>
</template>

<script lang="ts" setup>
import { Plus } from "lucide-vue-next";
import type { CreateMaterialDto, MaterialResponseDto } from "shared";

const props = defineProps({
  materials: {
    type: Array as PropType<MaterialResponseDto[]>,
    required: true,
  },
});
const createOpen = ref(false);
const route = useRoute();
const companyId = route.params.companyId as string;
const siteId = route.params.siteId as string;
const companyStore = useCompanyStore();
const authStore = useAuthStore();

const isAdminOrManager = computed(() => authStore.isManagerOrAdmin);

const handleCreateMaterial = async (payload: CreateMaterialDto) => {
  try {
    const created = await createMaterial({ companyId, siteId, payload });

    if (created) {
      createOpen.value = false;
      companyStore.fetchSiteDetails(companyId, siteId);
    } else {
      console.error("Failed to create user");
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
};
</script>
