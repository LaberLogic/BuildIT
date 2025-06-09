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
          <router-link
            to="/reset-password"
            class="text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </router-link>
        </div>

        <el-button
          type="primary"
          class="w-full"
          :loading="isLoading"
          @click="submitForm"
        >
          Sign in
        </el-button>
        <div v-if="errorMessage" class="text-red-600 text-sm mb-4">
          {{ errorMessage }}
        </div>
      </el-form>
    </div>
  </el-card>
</template>

<script setup lang="ts">
const form = ref({
  email: "",
  password: "",
});
const errorMessage = ref("");
const isLoading = ref(false);
const showPassword = ref(false);
const router = useRouter();

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const submitForm = async () => {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    const result = await signIn(form.value);

    if (!result.success) {
      errorMessage.value = "Wrong email or password.";
      return;
    }

    if (result.user?.role === "ADMIN") {
      await router.push("/company/");
    } else if (result.user?.companyId) {
      await router.push(`/company/${result.user?.companyId}/sites`);
    } else {
      errorMessage.value = "Missing company ID for this user.";
    }
  } catch (err) {
    console.error("Sign-in error:", err);
    errorMessage.value = "Something went wrong. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.el-input__suffix {
  cursor: pointer;
}
</style>
