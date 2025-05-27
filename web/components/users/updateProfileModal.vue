<template>
  <el-dialog
    v-model="localModelValue"
    title="Edit Profile"
    width="425px"
    @close="onCancel"
  >
    <el-form :model="editForm" label-position="top" class="space-y-4">
      <el-form-item label="First Name" prop="firstName">
        <el-input v-model="editForm.firstName" autocomplete="off" />
      </el-form-item>

      <el-form-item label="Last Name" prop="lastName">
        <el-input v-model="editForm.lastName" autocomplete="off" />
      </el-form-item>

      <el-form-item label="Email" prop="email">
        <el-input v-model="editForm.email" type="email" autocomplete="off" />
      </el-form-item>

      <el-form-item label="New Password (optional)">
        <el-input
          type="password"
          v-model="editForm.password"
          autocomplete="new-password"
          placeholder="Enter new password"
          @input="onPasswordInput"
        />
      </el-form-item>

      <el-form-item
        v-if="showConfirmPassword"
        label="Confirm New Password"
        :error="confirmPasswordError"
      >
        <el-input
          type="password"
          v-model="editForm.confirmPassword"
          autocomplete="new-password"
          placeholder="Confirm new password"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button variant="outline" @click="onCancel">Cancel</el-button>
        <el-button type="primary" @click="handleSave">Save Changes</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";

const props = defineProps({
  modelValue: Boolean,
  userData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "save"]);

const localModelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const editForm = reactive({
  firstName: props.userData.firstName || "",
  lastName: props.userData.lastName || "",
  email: props.userData.email || "",
  password: "",
  confirmPassword: "",
});

const showConfirmPassword = computed(() => editForm.password.length > 0);

const confirmPasswordError = computed(() =>
  showConfirmPassword.value && editForm.password !== editForm.confirmPassword
    ? "Passwords do not match"
    : "",
);

const onCancel = () => {
  emit("update:modelValue", false);
  resetForm();
};

const resetForm = () => {
  editForm.firstName = props.userData.firstName || "";
  editForm.lastName = props.userData.lastName || "";
  editForm.email = props.userData.email || "";
  editForm.password = "";
  editForm.confirmPassword = "";
};

const handleSave = () => {
  if (showConfirmPassword.value && confirmPasswordError.value) return;

  emit("save", editForm);
  emit("update:modelValue", false);
  resetForm();
};

const onPasswordInput = () => {
  if (!editForm.password) editForm.confirmPassword = "";
};
</script>
