<template>
  <el-card class="w-full max-w-md mx-auto border border-gray-200 shadow-sm">
    <div class="p-6">
      <el-form :model="form" class="space-y-4">
        <el-form-item label="Email" label-position="top">
          <el-input
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            :disabled="isLoading"
          />
        </el-form-item>

        <el-form-item label="Password" label-position="top">
          <el-input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            :disabled="isLoading"
            suffix-icon="View"
            @suffix-icon-click="togglePassword"
          />
        </el-form-item>

        <div class="flex items-center justify-between mb-4">
          <el-checkbox v-model="form.remember">Remember me</el-checkbox>
          <router-link
            to="/auth/forgot-password"
            class="text-sm text-blue-500 hover:underline"
          >
          </router-link>
        </div>

        <!-- Submit Button -->
        <el-button
          type="primary"
          class="w-full"
          :loading="isLoading"
          @click="submitForm"
        >
          Sign in
        </el-button>
      </el-form>
    </div>
  </el-card>
</template>

<script setup lang="ts">
const form = ref({
  email: "",
  password: "",
  remember: false,
});

const isLoading = ref(false);
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const submitForm = () => {
  isLoading.value = true;
  setTimeout(() => (isLoading.value = false), 1500);
};
</script>

<style scoped>
.el-input__suffix {
  cursor: pointer;
}
</style>
