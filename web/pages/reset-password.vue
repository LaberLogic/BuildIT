<template>
  <el-card
    class="w-full max-w-md mx-auto border border-gray-200 shadow-sm mt-10"
  >
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Reset Your Password</h2>
      <el-form :model="form" class="space-y-4" @submit.prevent="submit">
        <el-form-item label="Email" label-position="top" prop="email">
          <el-input
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            :disabled="isLoading"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="w-full"
          :loading="isLoading"
          @click="submit"
        >
          Send Reset Link
        </el-button>

        <div v-if="successMessage" class="text-green-600 text-sm mt-4">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="text-red-600 text-sm mt-4">
          {{ errorMessage }}
        </div>
      </el-form>
    </div>
  </el-card>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
const form = ref({
  email: "",
});

const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const router = useRouter();

const submit = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  isLoading.value = true;

  try {
    const result = await resetPasswordRequest({ email: form.value.email });

    if (!result.success) {
      errorMessage.value = "Could not send reset email. Please try again.";
    } else {
      successMessage.value = "Reset link sent! Redirecting to login...";
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    }
  } catch (e) {
    console.error("Reset request failed", e);
    errorMessage.value = "Something went wrong. Please try again later.";
  } finally {
    isLoading.value = false;
  }
};
</script>
