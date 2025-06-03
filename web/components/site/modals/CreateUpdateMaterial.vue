<template>
  <el-dialog :v-model="true" :title="title" width="425px" @close="onCancel">
    <el-form :model="editForm" label-position="top" class="space-y-4">
      <el-form-item label="Material Name" prop="name">
        <el-input v-model="editForm.name" />
      </el-form-item>

      <div class="flex gap-4">
        <el-form-item label="Quantity" prop="quantity" class="flex-1">
          <el-input v-model="editForm.quantity" type="number" />
        </el-form-item>

        <el-form-item label="Unit" prop="unit" class="flex-1">
          <el-input v-model="editForm.unit" />
        </el-form-item>
      </div>

      <el-form-item label="Threshold" prop="threshold">
        <el-input v-model="editForm.threshold" type="number" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button @click="onCancel">Cancel</el-button>
        <el-button type="primary" @click="handleSave">Save Changes</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import type { MaterialResponseDto } from "shared";

const props = defineProps({
  material: {
    type: Object as PropType<MaterialResponseDto>,
    required: false,
  },
});

const emit = defineEmits(["update:modelValue", "save"]);

const title = computed(() =>
  props.material ? `Edit ${props.material.name}` : "Create Material",
);

const editForm = ref({
  name: props.material?.name || "",
  quantity: props.material?.quantity || 0,
  unit: props.material?.unit || "",
  threshold: props.material?.threshold || 0,
});

const onCancel = () => {
  emit("update:modelValue", false);
};

const handleSave = () => {
  emit("save", { ...editForm });
  emit("update:modelValue", false);
};
</script>
