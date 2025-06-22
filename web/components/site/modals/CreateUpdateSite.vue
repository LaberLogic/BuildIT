<template>
  <el-dialog
    :title="title"
    class="w-[90vw] sm:w-[600px] max-w-full"
    @close="onCancel"
  >
    <el-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-position="top"
      class="grid gap-4 sm:gap-6 px-4 sm:px-6"
    >
      <el-form-item label="Site Name" prop="name">
        <el-input v-model="model.name" data-cy="input-site-name" />
      </el-form-item>

      <el-form-item label="Assign Users" prop="users">
        <el-select
          v-model="model.users"
          multiple
          clearable
          :value-key="'userId'"
          placeholder="Select users"
          data-cy="input-users"
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
            :data-cy="'user-option-' + user.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Status" prop="status">
        <el-select v-model="model.status" clearable data-cy="input-status">
          <el-option
            data-cy="input-status-option"
            label="ACTIVE"
            value="ACTIVE"
          />
          <el-option
            data-cy="input-status-option"
            label="INACTIVE"
            value="INACTIVE"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Priority" prop="priority">
        <el-select v-model="model.priority" clearable data-cy="input-priority">
          <el-option data-cy="input-priority-option" label="Low" value="low" />
          <el-option
            data-cy="input-priority-option"
            label="Medium"
            value="medium"
          />
          <el-option
            data-cy="input-priority-option"
            label="High"
            value="high"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="Start Date"
        prop="startDate"
        data-cy="input-start-date"
      >
        <el-date-picker
          v-model="model.startDate"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="Pick a date"
          style="width: 100%"
          clearable
        />
      </el-form-item>

      <el-form-item label="End Date" prop="endDate" data-cy="input-end-date">
        <el-date-picker
          v-model="model.endDate"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="Pick a date"
          style="width: 100%"
          clearable
        />
      </el-form-item>

      <el-checkbox v-model="includeAddress" data-cy="checkbox-include-address"
        >Include Address</el-checkbox
      >
      <div v-if="includeAddress">
        <el-form-item label="Street" prop="address.streetNumber">
          <el-input v-model="model.address.street" data-cy="input-street" />
        </el-form-item>

        <el-form-item label="Street Number" prop="address.streetNumber">
          <el-input
            v-model="model.address.streetNumber"
            data-cy="input-street-number"
          />
        </el-form-item>

        <el-form-item label="City" prop="address.city">
          <el-input v-model="model.address.city" data-cy="input-city" />
        </el-form-item>

        <el-form-item label="Postal Code" prop="address.postalCode">
          <el-input
            v-model="model.address.postalCode"
            data-cy="input-postal-code"
          />
        </el-form-item>

        <el-form-item label="Country" prop="address.country">
          <el-input v-model="model.address.country" data-cy="input-country" />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button @click="onCancel">Cancel</el-button>
        <el-button
          type="primary"
          data-cy="create-update-site-save-button"
          @click="handleSave"
        >
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
  startDate: undefined as string | undefined,
  endDate: undefined as string | undefined,
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
  if (props.site) {
    model.value.name = props.site.name || "";
    model.value.status = props.site.status || "";
    model.value.priority = props.site.priority || "";
    model.value.startDate =
      (props.site.startDate as unknown as string) ?? undefined;
    model.value.endDate =
      (props.site.endDate as unknown as string) ?? undefined;
    model.value.users = props.site.assignments || [];
    model.value.notes = props.site.notes || "";
    model.value.address = defaultForm().address;
  } else {
    model.value = defaultForm();
    includeAddress.value = false;
  }
};

watch(
  model,
  (newVal) => {
    console.log("Model updated:", newVal);
  },
  { deep: true },
);

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
    model.value.startDate =
      (newSite.startDate as unknown as string) ?? undefined;
    model.value.endDate = (newSite.endDate as unknown as string) ?? undefined;
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
  resetForm();
  emit("close", false);
};

const handleSave = async () => {
  await formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    const { address, ...rest } = model.value;
    const payload = {
      ...rest,
      startDate: model.value.startDate,
      endDate: model.value.endDate,
      users: model.value.users.map((u) => u.userId),
      ...((includeAddress.value || !isEditMode.value) && {
        address,
      }),
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
        await createSite({ companyId }, payload as unknown as CreateSiteDto);
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
