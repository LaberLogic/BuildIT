<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    @close="onCancel"
  >
    <el-form :model="model" label-position="top" class="space-y-4">
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
            :label="user.firstName"
            :value="{
              userId: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
            }"
          />
        </el-select>
      </el-form-item>

      <!-- Status & Priority -->
      <el-form-item label="Status" prop="status">
        <el-select v-model="model.status" placeholder="Select status" clearable>
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

      <!-- Dates -->
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

      <!-- Address Toggle -->
      <el-form-item>
        <el-checkbox v-model="includeAddress">Include Address</el-checkbox>
      </el-form-item>

      <!-- Address Fields -->
      <div v-if="includeAddress" class="grid grid-cols-2 gap-4">
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
import type { SiteResponseDto, UserResponseDto } from "shared";

const props = defineProps({
  site: {
    type: Object as PropType<SiteResponseDto | null>,
    required: false,
    default: null,
  },
  users: {
    type: Array as PropType<UserResponseDto[]>,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "save", "create"]);

const dialogVisible = ref(true);
const includeAddress = ref(false);

const users = computed(() => props.users);
const site = computed(() => props.site);
const isEditMode = computed(() => !!site.value?.id);
const title = computed(() =>
  isEditMode.value ? "Update Site" : "Create Site",
);

type Assignment = {
  userId: string;
  firstName: string;
  lastName: string;
};

const model = ref({
  name: "",
  status: "",
  priority: "",
  startDate: null as Date | null,
  endDate: null as Date | null,
  users: [] as Assignment[],
  address: {
    street: "",
    streetNumber: "",
    city: "",
    postalCode: "",
    country: "",
  },
  notes: "",
});

watch(
  site,
  (newSite) => {
    model.value.name = newSite?.name || "";
    model.value.status = newSite?.status || "";
    model.value.priority = newSite?.priority || "";
    model.value.startDate = newSite?.startDate
      ? new Date(newSite.startDate)
      : null;
    model.value.endDate = newSite?.endDate ? new Date(newSite.endDate) : null;
    model.value.users = newSite?.assignments || [];
    model.value.notes = newSite?.notes || "";
    model.value.address = newSite?.address || {
      street: "",
      streetNumber: "",
      city: "",
      postalCode: "",
      country: "",
    };
    includeAddress.value = !!newSite?.address;
  },
  { immediate: true },
);

watch(includeAddress, (val) => {
  if (!val) {
    model.value.address = {
      street: "",
      streetNumber: "",
      city: "",
      postalCode: "",
      country: "",
    };
  }
});

const onCancel = () => {
  dialogVisible.value = false;
  emit("update:modelValue", false);
};

const handleSave = () => {
  const payload = {
    ...model.value,
    startDate: model.value.startDate
      ? model.value.startDate.toISOString()
      : null,
    endDate: model.value.endDate ? model.value.endDate.toISOString() : null,
    address: includeAddress.value ? model.value.address : undefined,
    users: model.value.users.map((u) => u.userId),
  };

  emit(isEditMode.value ? "save" : "create", payload);
};
</script>
