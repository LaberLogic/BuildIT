<template>
  <div class="max-w-md mx-auto mt-20 p-6 border rounded shadow">
    <h2 class="text-2xl font-bold mb-6">Set Your Password</h2>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="onSubmit"
    >
      <el-form-item label="New Password" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>

      <el-form-item label="Confirm Password" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSubmit">
          Set Password
        </el-button>
      </el-form-item>

      <el-alert
        v-if="error"
        type="error"
        :title="error"
        show-icon
        class="mt-2"
      />
      <el-alert
        v-if="success"
        type="success"
        title="Password set successfully!"
        show-icon
        class="mt-2"
      />
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";

definePageMeta({
  layout: "auth",
});

const formRef = ref<FormInstance | null>(null);

const form = ref({
  password: "",
  confirmPassword: "",
});

const rules = {
  password: [
    { required: true, message: "Password is required", trigger: "blur" },
    {
      min: 8,
      message: "Password must be at least 8 characters",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: "Please confirm your password",
      trigger: "blur",
    },
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validator: (rule: any, value: string, callback: any) => {
        if (value !== form.value.password) {
          callback(new Error("Passwords don't match"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const loading = ref(false);
const success = ref(false);
const error = ref("");

const router = useRouter();
const route = useRoute();

const tokenRaw = route.query.token;
const token = Array.isArray(tokenRaw)
  ? (tokenRaw[0] as string)
  : ((tokenRaw ?? "") as string);

const onSubmit = () => {
  if (!formRef.value) return;

  formRef.value.validate((valid: boolean) => {
    if (!valid) return;

    loading.value = true;
    error.value = "";
    setPassword({ password: form.value.password }, token)
      .then(() => {
        success.value = true;
        setTimeout(() => router.push("/auth/login"), 1500);
      })
      .catch((err) => {
        error.value =
          err?.data?.error || "An error occurred while setting your password.";
      })
      .finally(() => {
        loading.value = false;
      });
  });
};
</script>
