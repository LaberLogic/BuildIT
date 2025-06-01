<template>
  <el-dialog
    v-model="modalOpen"
    title="Update Site"
    width="500px"
    @close="onCancel"
  >
    <el-form :model="editForm" label-position="top" class="space-y-4">
      <el-form-item label="Site Name" prop="name">
        <el-input v-model="editForm.name" />
      </el-form-item>

      <el-form-item label="Assign User" prop="userId">
        <el-select
          v-model="editForm.userId"
          placeholder="Select a user"
          multiple
        >
          <el-option
            v-for="user in users"
            :key="user.id"
            :label="user.name"
            :value="user.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Status" prop="status">
        <el-select v-model="editForm.status" placeholder="Select status">
          <el-option label="Planned" value="planned" />
          <el-option label="In Progress" value="in_progress" />
          <el-option label="Completed" value="completed" />
        </el-select>
      </el-form-item>

      <el-form-item label="Priority" prop="priority">
        <el-select v-model="editForm.priority" placeholder="Select priority">
          <el-option label="Low" value="low" />
          <el-option label="Medium" value="medium" />
          <el-option label="High" value="high" />
        </el-select>
      </el-form-item>

      <div class="grid grid-cols-2 gap-4">
        <el-form-item label="Start Date" prop="startDate">
          <el-date-picker
            v-model="editForm.startDate"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="End Date" prop="endDate">
          <el-date-picker
            v-model="editForm.endDate"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>
      </div>
      <el-form-item>
        <el-checkbox v-model="includeAddress">Include Address</el-checkbox>
      </el-form-item>

      <div v-if="includeAddress" class="grid grid-cols-2 gap-4">
        <el-form-item label="Street" prop="address.street">
          <el-input v-model="editForm.address.street" />
        </el-form-item>

        <el-form-item label="Street Number" prop="address.streetNumber">
          <el-input v-model="editForm.address.streetNumber" />
        </el-form-item>

        <el-form-item label="City" prop="address.city">
          <el-input v-model="editForm.address.city" />
        </el-form-item>

        <el-form-item label="Postal Code" prop="address.postalCode">
          <el-input v-model="editForm.address.postalCode" />
        </el-form-item>
      </div>
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
import { ref, computed, watch } from "vue";

const props = defineProps({
  modalOpen: Boolean,
  site: {
    type: Object as () => {
      id: string;
      name: string;
      address: {
        street: string;
        streetNumber: string;
        city: string;
        postalCode: string;
      } | null;
      status: string;
      priority: string;
      endDate: string;
      startDate: string;
      userId?: string;
    },
    required: false,
  },
});

const emit = defineEmits(["update:modelValue", "save"]);

const modalOpen = computed(() => props.modalOpen);

const includeAddress = ref(!!props.site?.address);

const users = ref([
  { id: "1", name: "Alice Johnson" },
  { id: "2", name: "Bob Smith" },
  { id: "3", name: "Charlie Lee" },
]);

const editForm = ref({
  name: props.site?.name || "",
  address: props.site?.address || {
    street: "",
    streetNumber: "",
    city: "",
    postalCode: "",
  },
  status: props.site?.status || "",
  priority: props.site?.priority || "",
  startDate: props.site?.startDate || "",
  endDate: props.site?.endDate || "",
  userId: props.site?.userId || "",
});

watch(includeAddress, (val) => {
  if (!val) {
    editForm.value.address = {
      street: "",
      streetNumber: "",
      city: "",
      postalCode: "",
    };
  } else if (!editForm.value.address) {
    editForm.value.address = {
      street: "",
      streetNumber: "",
      city: "",
      postalCode: "",
    };
  }
});

const onCancel = () => {
  emit("update:modelValue", false);
};

const handleSave = () => {
  const payload = {
    ...editForm.value,
    address: includeAddress.value ? editForm.value.address : null,
  };
  emit("save", payload);
  emit("update:modelValue", false);
};
</script>
