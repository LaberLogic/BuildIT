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
          <el-checkbox>Remember me</el-checkbox>
          <router-link
            to="/auth/forgot-password"
            class="text-sm text-blue-500 hover:underline"
          >
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
const router = useRouter();
const isLoading = ref(false);
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const submitForm = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  const success = await login(form.value);

  if (!success) {
    errorMessage.value = "Wrong email or password.";
  }

  isLoading.value = false;
  router.push("/");
};

const login = async (credentials) => {
  try {
    isLoading.value = true;
    const response = await $fetch("http://localhost:3001/auth/signIn", {
      method: "POST",
      body: credentials,
    });

    const token = response.user.accessToken;

    useCookie("token", { maxAge: 60 * 60 * 24 * 7 }).value = token;
    isLoading.value = false;
    return true;
  } catch (error) {
    if (error?.status === 404) {
      console.error("Invalid credentials");
    } else {
      console.error("Login failed:", error);
    }
    return false;
  }
};
</script>

<style scoped>
.el-input__suffix {
  cursor: pointer;
}
</style>
