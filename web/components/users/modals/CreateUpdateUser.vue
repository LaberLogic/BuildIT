<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="425px"
    @close="onCancel"
  >
    <el-form :model="model" label-position="top" class="space-y-4">
      <div class="flex gap-4">
        <el-form-item label="First Name" prop="firstName" class="flex-1">
          <el-input v-model="model.firstName" />
        </el-form-item>

        <el-form-item label="Last Name" prop="lastName" class="flex-1">
          <el-input v-model="model.lastName" />
        </el-form-item>
      </div>

      <el-form-item label="Email" prop="email">
        <el-input v-model="model.email" type="email" />
      </el-form-item>

      <el-form-item v-if="!isProfile" label="Role" prop="role">
        <el-select
          v-model="model.role"
          placeholder="Select"
          style="width: 100%"
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
          v-model="model.password"
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
          v-model="model.confirmPassword"
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
import type { PropType } from "vue";
import type { UserResponseDto } from "shared";

const props = defineProps({
  user: {
    type: Object as PropType<UserResponseDto>,
    default: undefined,
  },
  isProfile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "save"]);

const visible = ref(true);

const isCreate = computed(() => !props.user);

const model: Ref<{
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password?: string;
  confirmPassword?: string;
}> = reactive({
  firstName: props.user?.firstName || "",
  lastName: props.user?.lastName || "",
  email: props.user?.email || "",
  role: props.user?.role || "",
  password: undefined,
  confirmPassword: undefined,
});

const options = [
  { value: "MANAGER", label: "Manager" },
  { value: "WORKER", label: "Worker" },
];

const showPasswordFields = computed(() => isCreate.value || props.isProfile);
const showConfirmPassword = computed(() => model?.password?.length > 0);

const confirmPasswordError = computed(() =>
  showConfirmPassword.value && model?.password !== model?.confirmPassword
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

const onPasswordInput = () => {
  if (!model.password) model.confirmPassword = "";
};

const resetForm = () => {
  model.firstName = props.user?.firstName || "";
  model.lastName = props.user?.lastName || "";
  model.email = props.user?.email || "";
  model.role = props.user?.role || "";
  model.password = undefined;
  model.confirmPassword = undefined;
};

const onCancel = () => {
  emit("update:modelValue", false);
  visible.value = false;
  resetForm();
};

const handleSave = () => {
  if (showConfirmPassword.value && confirmPasswordError.value) return;
  emit("save", { ...model });
  emit("update:modelValue", false);
  visible.value = false;
  resetForm();
};
</script>
