<template>
  <el-dialog :model-value="true" :title="title" width="425px" @close="onCancel">
    <el-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-position="top"
      class="space-y-4"
    >
      <el-form-item label="Material Name" prop="name">
        <el-input v-model="model.name" />
      </el-form-item>

      <div class="flex gap-4">
        <el-form-item label="Amount" prop="amount" class="flex-1">
          <el-input v-model.number="model.amount" type="number" />
        </el-form-item>

        <el-form-item label="Unit" prop="unit" class="flex-1">
          <el-input v-model="model.unit" />
        </el-form-item>
      </div>

      <el-form-item label="Threshold" prop="threshold">
        <el-input v-model.number="model.threshold" type="number" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button @click="onCancel">Cancel</el-button>
        <el-button type="primary" @click="handleSave">
          {{ props.material ? "Save Changes" : "Create Material" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import type {
  CreateMaterialDto,
  MaterialResponseDto,
  UpdateMaterialDto,
} from "shared";

const props = defineProps({
  material: {
    type: Object as PropType<MaterialResponseDto>,
    required: false,
  },
});

const emit = defineEmits(["close"]);

const route = useRoute();
const companyId = route.params.companyId as string;
const siteId = route.params.siteId as string;
const title = computed(() =>
  props.material ? `Edit ${props.material.name}` : "Create Material",
);

const formRef = ref();

const companyStore = useCompanyStore();

const model = ref({
  name: props.material?.name || "",
  amount: props.material?.amount ?? 0,
  unit: props.material?.unit || "",
  threshold: props.material?.threshold ?? 0,
});

const rules = {
  name: [
    { required: true, message: "Material name is required", trigger: "blur" },
  ],
  amount: [
    {
      required: true,
      type: "number",
      message: "Amount is required",
      trigger: "blur",
    },
  ],
  unit: [{ required: true, message: "Unit is required", trigger: "blur" }],
  threshold: [
    {
      required: true,
      type: "number",
      message: "Threshold is required",
      trigger: "blur",
    },
  ],
};

const handleSave = async () => {
  await formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;

    const payload = {
      name: model.value.name,
      amount: model.value.amount,
      unit: model.value.unit,
      threshold: model.value.threshold,
    };

    try {
      if (props.material) {
        await updateMaterial({
          companyId,
          siteId,
          materialId: props.material.id,
          payload: payload as UpdateMaterialDto,
        });
        ElMessage.success("Material updated successfully");
      } else {
        await createMaterial({
          companyId,
          siteId,
          payload: payload as CreateMaterialDto,
        });
        ElMessage.success("Material created successfully");
      }

      await companyStore.fetchSiteDetails(companyId, siteId);
      emit("close");
    } catch (error) {
      console.error("Error saving material:", error);
      ElMessage.error("Something went wrong");
    }
  });
};

const onCancel = () => {
  emit("close");
};
</script>
