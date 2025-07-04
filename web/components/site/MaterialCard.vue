<template>
  <div
    v-if="material"
    class="border border-gray-200 rounded-md"
    data-cy="material-card"
  >
    <div
      class="flex flex-wrap items-start justify-between p-3 border border-gray-200 rounded-md gap-2"
      data-cy="material-card-content"
    >
      <!-- Left: Material Info -->
      <div class="flex-1 min-w-[200px]">
        <div class="flex items-center flex-wrap">
          <span class="text-label" data-cy="material-name">
            {{ material.name }}
          </span>
          <el-tag
            :type="getStatusBadge()"
            size="small"
            effect="light"
            class="capitalize ml-1 mt-1"
            data-cy="material-status"
          >
            {{ getStatusName() }}
          </el-tag>
        </div>
        <div class="text-sm text-gray-500 mt-1" data-cy="material-threshold">
          Threshold: {{ material.threshold }}
        </div>
      </div>

      <!-- Right: Controls -->
      <div
        class="flex flex-wrap items-center justify-end gap-2 mt-2 sm:mt-0"
        data-cy="material-controls"
      >
        <!-- Increment / Decrement -->
        <div class="flex items-center space-x-2">
          <el-button
            class="btn-icon flex-shrink-0"
            plain
            :disabled="localAmount <= 0"
            data-cy="material-decrement"
            @mousedown="holdDecrement.start"
            @mouseup="holdDecrement.stop"
            @mouseleave="holdDecrement.stop"
            @touchstart.prevent="holdDecrement.start"
            @touchend="holdDecrement.stop"
          >
            <el-icon><Minus /></el-icon>
          </el-button>

          <span
            class="mx-1 w-16 text-center text-sm font-medium"
            data-cy="material-amount"
          >
            {{ localAmount }} {{ material.unit }}
          </span>

          <el-button
            class="btn-icon flex-shrink-0"
            plain
            data-cy="material-increment"
            @mousedown="holdIncrement.start"
            @mouseup="holdIncrement.stop"
            @mouseleave="holdIncrement.stop"
            @touchstart.prevent="holdIncrement.start"
            @touchend="holdIncrement.stop"
          >
            <el-icon><Plus /></el-icon>
          </el-button>
        </div>

        <!-- Edit & Delete -->
        <div class="flex space-x-2">
          <el-button
            class="btn-icon"
            data-cy="edit-material-button"
            @click="editOpen = true"
          >
            <el-icon><Edit /></el-icon>
          </el-button>

          <el-button
            v-if="isAdminOrManager"
            class="btn-icon"
            data-cy="delete-material-button"
            @click="deleteOpen = true"
          >
            <el-icon><Trash /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <site-modals-create-update-material
      v-model="editOpen"
      :material="material"
      @close="editOpen = false"
    />
    <general-confirm-action
      v-model="deleteOpen"
      @save="deleteMaterialHandler"
    />
  </div>
</template>

<script setup lang="ts">
import { Edit, Minus, Plus, Trash } from "lucide-vue-next";
import type { MaterialResponseDto } from "shared";

const props = defineProps({
  material: {
    type: Object as PropType<MaterialResponseDto>,
    required: true,
  },
});

function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const route = useRoute();

const companyId = route.params.companyId as string;
const siteId = route.params.siteId as string;

const editOpen = ref(false);
const deleteOpen = ref(false);

const localAmount = ref(props.material.amount);

const authStore = useAuthStore();
const companyStore = useCompanyStore();

const isAdminOrManager = computed(() => authStore.isManagerOrAdmin);

let accumulatedDelta = 0;

const debouncedAdjust = debounce(async () => {
  try {
    await incrementDecrementMaterial({
      companyId: companyId,
      siteId: siteId,
      materialId: props.material.id,
      delta: accumulatedDelta,
    });
    await companyStore.fetchSiteDetails(companyId, siteId);
    accumulatedDelta = 0;
  } catch (err) {
    console.error("Failed to adjust quantity", err);
    localAmount.value = props.material.amount;
    accumulatedDelta = 0;
  }
}, 500);

const onIncrement = () => {
  accumulatedDelta++;
  localAmount.value++;
  debouncedAdjust();
};

const onDecrement = () => {
  if (localAmount.value <= 0) return;
  accumulatedDelta--;
  localAmount.value--;
  debouncedAdjust();
};

const holdIncrement = useHoldRepeat(onIncrement, 120);
const holdDecrement = useHoldRepeat(onDecrement, 120);

watch(
  () => props.material.amount,
  (newVal) => {
    localAmount.value = newVal;
    accumulatedDelta = 0;
  },
);

const getStatusBadge = (): "warning" | "success" | "info" | "danger" => {
  if (localAmount.value === 0) return "danger";
  if (localAmount.value <= props.material.threshold) return "warning";
  return "success";
};

const getStatusName = (): string => {
  if (localAmount.value === 0) return "Out of Stock";
  if (localAmount.value <= props.material.threshold) return "Low Stock";
  return "In Stock";
};

const deleteMaterialHandler = async () => {
  await deleteMaterial({ companyId, siteId, materialId: props.material.id });

  await companyStore.fetchSiteDetails(companyId, siteId);
};
</script>
