<template>
  <el-dialog
    :v-model="true"
    :title="dialogTitle"
    width="425px"
    @close="onCancel"
  >
    <el-form :model="editForm" label-position="top" class="space-y-4">
      <div style="display: flex; gap: 16px">
        <el-form-item label="First Name" prop="firstName" style="flex: 1">
          <el-input v-model="editForm.firstName" />
        </el-form-item>

        <el-form-item label="Last Name" prop="lastName" style="flex: 1">
          <el-input v-model="editForm.lastName" />
        </el-form-item>
      </div>

      <el-form-item label="Email" prop="email">
        <el-input v-model="editForm.email" type="email" />
      </el-form-item>

      <el-form-item v-if="!isProfile" label="Role" prop="role">
        <el-select
          v-model="editForm.role"
          placeholder="Select"
          size="large"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="showPasswordFields"
        label="New Password"
        :required="isCreate"
      >
        <el-input
          v-model="editForm.password"
          type="password"
          autocomplete="new-password"
          :placeholder="
            isCreate ? 'Enter password' : 'Enter new password (optional)'
          "
          @input="onPasswordInput"
        />
      </el-form-item>

      <el-form-item
        v-if="showConfirmPassword"
        label="Confirm Password"
        :error="confirmPasswordError"
        :required="isCreate"
      >
        <el-input
          v-model="editForm.confirmPassword"
          type="password"
          autocomplete="new-password"
          :placeholder="isCreate ? 'Confirm password' : 'Confirm new password'"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button @click="onCancel">Cancel</el-button>
        <el-button type="primary" @click="handleSave">
          {{ isCreate ? "Create User" : "Save Changes" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UserResponseDto } from "shared";
const props = defineProps({
  user: {
    type: Object as PropType<UserResponseDto>,
  },
  isProfile: {
    type: Boolean,
    default: false,
  },
});

const options = [
  { value: "MANAGER", label: "Manager" },
  { value: "WORKER", label: "Worker" },
];

const emit = defineEmits(["update:modelValue", "save"]);

const isCreate = computed(() => {
  return !props.user;
});

const editForm = reactive({
  firstName: props.user?.firstName || "",
  lastName: props.user?.lastName || "",
  email: props.user?.email || "",
  role: props.user?.role || "",
  password: "",
  confirmPassword: "",
});

const showPasswordFields = computed(() => props.isProfile);

const showConfirmPassword = computed(() => editForm.password.length > 0);

const confirmPasswordError = computed(() =>
  showConfirmPassword.value && editForm.password !== editForm.confirmPassword
    ? "Passwords do not match"
    : "",
);

const dialogTitle = computed(() =>
  isCreate.value
    ? "Create User"
    : props.isProfile
      ? "Edit Profile"
      : "Edit User",
);

const onCancel = () => {
  emit("update:modelValue", false);
  resetForm();
};

const resetForm = () => {
  editForm.firstName = props.user?.firstName || "";
  editForm.lastName = props.user?.lastName || "";
  editForm.email = props.user?.email || "";
  editForm.password = "";
  editForm.confirmPassword = "";
};

const handleSave = () => {
  if (showConfirmPassword.value && confirmPasswordError.value) return;

  if (isCreate.value && !editForm.password) return;

  emit("save", { ...editForm });
  emit("update:modelValue", false);
  resetForm();
};

const onPasswordInput = () => {
  if (!editForm.password) editForm.confirmPassword = "";
};
</script>
