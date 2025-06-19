<template>
  <el-dialog :title="dialogTitle" width="425px" @close="onCancel">
    <el-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-position="top"
      class="space-y-4"
    >
      <div class="flex gap-4">
        <el-form-item label="First Name" prop="firstName" class="flex-1">
          <el-input v-model="model.firstName" data-cy="input-first-name" />
        </el-form-item>

        <el-form-item label="Last Name" prop="lastName" class="flex-1">
          <el-input v-model="model.lastName" data-cy="input-last-name" />
        </el-form-item>
      </div>

      <el-form-item label="Email" prop="email">
        <el-input v-model="model.email" type="email" data-cy="input-email" />
      </el-form-item>

      <el-form-item v-if="!isProfile" label="Role" prop="role">
        <el-select
          v-model="model.role"
          placeholder="Select"
          style="width: 100%"
          data-cy="select-role"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :data-cy="`option-role-${item.value}`"
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
          data-cy="input-password"
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
          data-cy="input-confirm-password"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button data-cy="btn-cancel" @click="onCancel">Cancel</el-button>
        <el-button
          type="primary"
          :loading="loading"
          data-cy="btn-submit"
          @click="handleSave"
        >
          {{ isCreate ? "Create User" : "Save Changes" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import type { CreateUserDto, UpdateUserDto, UserResponseDto } from "shared";
import type { PropType } from "vue";

const props = defineProps({
  user: Object as PropType<UserResponseDto>,
  isProfile: Boolean,
});

const emit = defineEmits(["close"]);
const route = useRoute();
const companyId = route.params.companyId as string;
const companyStore = useCompanyStore();

const isCreate = computed(() => !props.user);
const formRef = ref();
const loading = ref(false);

const model = reactive({
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  password: "",
  confirmPassword: "",
});

watch(
  () => props.user,
  (user) => {
    model.firstName = user?.firstName || "";
    model.lastName = user?.lastName || "";
    model.email = user?.email || "";
    model.role = user?.role || "";
    model.password = "";
    model.confirmPassword = "";
  },
  { immediate: true },
);

const rules = {
  firstName: [
    { required: true, message: "First name is required", trigger: "blur" },
  ],
  lastName: [
    { required: true, message: "Last name is required", trigger: "blur" },
  ],
  email: [{ required: true, message: "Email is required", trigger: "blur" }],
  role: [
    {
      required: !props.isProfile,
      message: "Role is required",
      trigger: "change",
    },
  ],
};

const options = [
  { value: "MANAGER", label: "Manager" },
  { value: "WORKER", label: "Worker" },
];

const showPasswordFields = computed(() => props.isProfile);
const showConfirmPassword = computed(() => model.password.length > 0);
const confirmPasswordError = computed(() =>
  showConfirmPassword.value && model.password !== model.confirmPassword
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

const onCancel = () => {
  emit("close", false);
};

const handleSave = async () => {
  await formRef.value?.validate(async (valid: boolean) => {
    if (!valid || (showConfirmPassword.value && confirmPasswordError.value))
      return;

    loading.value = true;
    const payload: Partial<CreateUserDto & UpdateUserDto> = {
      firstName: model.firstName,
      lastName: model.lastName,
      email: model.email,
      ...(props.isProfile
        ? {}
        : { role: model.role as "MANAGER" | "WORKER" | "ADMIN" }),
    };

    if (model.password) {
      payload.password = model.password;
    }

    try {
      if (isCreate.value) {
        await createUser(companyId, payload as CreateUserDto);
        ElMessage.success("User created successfully");
      } else if (props.isProfile) {
        await updateProfile(payload as UpdateUserDto);
        ElMessage.success("Profile updated successfully");
      } else {
        await updateUser(companyId, props.user!.id, payload as UpdateUserDto);
        ElMessage.success("User updated successfully");
      }

      if (!props.isProfile) {
        await companyStore.fetchUsers(companyId);
      } else {
        await useAuthStore().fetchUser();
      }
    } catch (error) {
      console.error("Error saving user:", error);
      ElMessage.error("An error occurred");
    } finally {
      loading.value = false;
      emit("close", false);
    }
  });
};
</script>
