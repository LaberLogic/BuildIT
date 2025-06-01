<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4"
  >
    <auth-header-with-icon
      :title="registerTitle"
      :subtitle="registerSubTitle"
      class="mb-4"
    />

    <div class="mb-6 text-center">
      <div class="flex items-center justify-center space-x-2">
        <div
          class="h-2 w-8 rounded-full transition-colors duration-300"
          :class="currentStep === 1 ? 'bg-blue-500' : 'bg-gray-200'"
        />
        <div
          class="h-2 w-8 rounded-full transition-colors duration-300"
          :class="currentStep === 2 ? 'bg-blue-500' : 'bg-gray-200'"
        />
      </div>
      <p v-if="currentStep === 1" class="text-xs text-gray-500 mt-2">
        Step 1 of 2
      </p>
      <p v-if="currentStep === 2" class="text-xs text-gray-500 mt-2">
        Step 2 of 2
      </p>
    </div>

    <el-card class="w-full max-w-md border border-gray-200 shadow-sm">
      <div class="p-6">
        <auth-register-user-form
          v-if="currentStep === 1"
          @next-step="handleNextStep"
        />
        <auth-register-company-form
          v-else
          @next-step="handleNextStep"
          @previous-step="handlePreviousStep"
        />
        <div class="text-center mt-6">
          <p class="text-sm text-gray-600">
            Already have an account?
            <NuxtLink
              href="/auth/login"
              class="text-blue-500 hover:text-blue-600 font-medium"
            >
              Sign in
            </NuxtLink>
          </p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElNotification } from "element-plus";

definePageMeta({
  layout: "auth",
});

const registerTitle = "Create account";
const registerSubTitle = "Tell us more about yourself"; // fixed typo 'mor' → 'more'

const currentStep = ref(1);
const userFormData = ref<Record<string, any> | null>(null);
const companyFormData = ref<Record<string, any> | null>(null);

const router = useRouter();

const handleNextStep = (data: Record<string, any>) => {
  if (currentStep.value === 1) {
    userFormData.value = data;
    currentStep.value = 2;
  } else if (currentStep.value === 2) {
    companyFormData.value = data;
    submitRegistration({ ...userFormData.value, ...companyFormData.value });
  }
};

const handlePreviousStep = () => {
  currentStep.value = 1;
};

const submitRegistration = async (payload: RegisterDto) => {
  try {
    await register(payload);

    ElNotification({
      title: "Success",
      message: "You can now log in",
      type: "success",
    });

    router.push("/auth/login");
  } catch (error: any) {
    if (error?.response?.status === 409) {
      ElNotification({
        title: "Error",
        message: "Email already in use. Reset Password if necessary",
        type: "error",
      });
    } else {
      ElNotification({
        title: "Error",
        message: "Registration failed. Please try again later.",
        type: "error",
      });
    }
    console.error("Register failed:", error);
  }
};
</script>
