<template>
  <el-dialog :title="title" width="600px" @close="onCancel">
    <el-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-position="top"
      class="grid gap-6"
    >
      <el-form-item label="Site Name" prop="name">
        <el-input v-model="model.name" />
      </el-form-item>

      <el-form-item label="Assign Users" prop="users">
        <el-select
          v-model="model.users"
          placeholder="Select users"
          multiple
          clearable
          :value-key="'userId'"
        >
          <el-option
            v-for="user in users"
            :key="user.id"
            :label="user.firstName + ' ' + user.lastName"
            :value="{
              userId: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
            }"
          />
        </el-select>
      </el-form-item>

      <div class="grid grid-cols-2 gap-4">
        <el-form-item label="Status" prop="status">
          <el-select
            v-model="model.status"
            placeholder="Select status"
            clearable
          >
            <el-option label="ACTIVE" value="ACTIVE" />
            <el-option label="INACTIVE" value="INACTIVE" />
          </el-select>
        </el-form-item>

        <el-form-item label="Priority" prop="priority">
          <el-select
            v-model="model.priority"
            placeholder="Select priority"
            clearable
          >
            <el-option label="Low" value="low" />
            <el-option label="Medium" value="medium" />
            <el-option label="High" value="high" />
          </el-select>
        </el-form-item>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <el-form-item label="Start Date" prop="startDate">
          <el-date-picker
            v-model="model.startDate"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
            clearable
          />
        </el-form-item>

        <el-form-item label="End Date" prop="endDate">
          <el-date-picker
            v-model="model.endDate"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
            clearable
          />
        </el-form-item>
      </div>

      <el-form-item v-if="isEditMode">
        <el-checkbox v-model="includeAddress">Include Address</el-checkbox>
      </el-form-item>

      <!-- Address Fields -->
      <div v-if="!isEditMode || includeAddress" class="grid grid-cols-2 gap-4">
        <el-form-item label="Street" prop="address.street">
          <el-input v-model="model.address.street" />
        </el-form-item>

        <el-form-item label="Street Number" prop="address.streetNumber">
          <el-input v-model="model.address.streetNumber" />
        </el-form-item>

        <el-form-item label="City" prop="address.city">
          <el-input v-model="model.address.city" />
        </el-form-item>

        <el-form-item label="Postal Code" prop="address.postalCode">
          <el-input v-model="model.address.postalCode" />
        </el-form-item>

        <el-form-item label="Country" prop="address.country">
          <el-input v-model="model.address.country" />
        </el-form-item>
      </div>
    </el-form>

    <!-- Footer -->
    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button @click="onCancel">Cancel</el-button>
        <el-button type="primary" @click="handleSave">
          {{ isEditMode ? "Save Changes" : "Create Site" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import type {
  CreateSiteDto,
  SiteResponseDto,
  UpdateSiteDto,
  UserResponseDto,
} from "shared";
import type { PropType } from "vue";

const props = defineProps({
  site: {
    type: Object as PropType<SiteResponseDto | null>,
    default: null,
  },
  users: {
    type: Array as PropType<UserResponseDto[]>,
    required: true,
  },
});

const formRef = ref();
const route = useRoute();
const companyId = route.params.companyId as string;
const companyStore = useCompanyStore();

const includeAddress = ref(false);
const emit = defineEmits(["close"]);

const isEditMode = computed(() => !!props.site?.id);
const title = computed(() =>
  isEditMode.value ? "Update Site" : "Create Site",
);

const defaultForm = () => ({
  name: "",
  status: "",
  priority: "",
  startDate: undefined as Date | undefined,
  endDate: undefined as Date | undefined,
  users: [] as { userId: string; firstName: string; lastName: string }[],
  address: {
    street: "",
    streetNumber: "",
    city: "",
    postalCode: "",
    country: "",
  },
  notes: "",
});

const model = ref(defaultForm());

const resetForm = () => {
  model.value = defaultForm();
  includeAddress.value = false;
};

watch(
  () => props.site,
  (newSite) => {
    if (!newSite) {
      resetForm();
      return;
    }

    model.value.name = newSite.name || "";
    model.value.status = newSite.status || "";
    model.value.priority = newSite.priority || "";
    model.value.startDate = newSite.startDate
      ? new Date(newSite.startDate)
      : undefined;
    model.value.endDate = newSite.endDate
      ? new Date(newSite.endDate)
      : undefined;
    model.value.users = newSite.assignments || [];
    model.value.notes = newSite.notes || "";

    model.value.address = defaultForm().address;
  },
  { immediate: true },
);

watch(includeAddress, (val) => {
  if (!val) {
    model.value.address = defaultForm().address;
  }
});

const onCancel = () => {
  emit("close", false);
  resetForm();
};

const handleSave = async () => {
  await formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;

    const payload = {
      ...model.value,
      startDate: model.value.startDate,
      endDate: model.value.endDate,
      users: model.value.users.map((u) => u.userId),
      address: model.value.address,
    };

    try {
      if (isEditMode.value && props.site) {
        await updateSite(
          { companyId, siteId: props.site.id },
          payload as UpdateSiteDto,
        );
        await companyStore.fetchSiteDetails(companyId, props.site.id);
        ElMessage.success("Site updated successfully");
      } else {
        await createSite({ companyId }, payload as CreateSiteDto);
        await companyStore.fetchSites(companyId);
        ElMessage.success("Site created successfully");
      }

      resetForm();
    } catch (err) {
      ElMessage.error("Site create/update failed");
      console.error("Save failed", err);
    }
    emit("close");
  });
};

const rules = computed(() => {
  const required = [{ required: true, message: "Required", trigger: "blur" }];
  const dateRule = [
    { required: true, message: "Pick a date", trigger: "change" },
  ];

  const addressRule = !isEditMode.value || includeAddress.value ? required : [];

  return {
    name: required,
    status: required,
    priority: required,
    startDate: dateRule,
    endDate: dateRule,
    users: required,
    "address.street": addressRule,
    "address.streetNumber": addressRule,
    "address.city": addressRule,
    "address.postalCode": addressRule,
    "address.country": addressRule,
  };
});

onMounted(() => {
  if (!props.site) {
    includeAddress.value = true;
    resetForm();
  }
});
</script>
