<template>
  <div
    v-if="material"
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
        <el-button
          class="btn-icon"
          plain
          @mousedown="holdIncrement.start"
          @mouseup="holdIncrement.stop"
          @mouseleave="holdIncrement.stop"
          @touchstart.prevent="holdIncrement.start"
          @touchend="holdIncrement.stop"
        >
          <el-icon><Plus /></el-icon>
        </el-button>

        <span class="mx-2 min-w-[40px] text-center">
          {{ localAmount }} {{ material.unit }}
        </span>

        <el-button
          class="btn-icon"
          plain
          :disabled="localAmount <= 0"
          @mousedown="holdDecrement.start"
          @mouseup="holdDecrement.stop"
          @mouseleave="holdDecrement.stop"
          @touchstart.prevent="holdDecrement.start"
          @touchend="holdDecrement.stop"
        >
          <el-icon><Minus /></el-icon>
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
      @save="handleUpdateMaterial"
    />
    <general-confirm-action v-model="deleteOpen" />
  </div>
</template>

<script setup lang="ts">
import { Edit, Minus, Plus, Trash } from "lucide-vue-next";
import type { MaterialResponseDto, UpdateMaterialDto } from "shared";

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

const companyStore = useCompanyStore();

const editOpen = ref(false);
const deleteOpen = ref(false);

const localAmount = ref(props.material.amount);

let accumulatedDelta = 0;

const debouncedAdjust = debounce(async () => {
  try {
    await incrementDecrementMaterial({
      companyId: companyId,
      siteId: siteId,
      materialId: props.material.id,
      delta: accumulatedDelta,
    });
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

const handleUpdateMaterial = async (payload: UpdateMaterialDto) => {
  try {
    const updated = await updateMaterial({
      companyId,
      siteId,
      materialId: props.material.id,
      payload,
    });

    if (updated) {
      editOpen.value = false;
      companyStore.fetchSiteDetails(companyId, siteId);
    } else {
      console.error("Failed to create user");
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
};
</script>
