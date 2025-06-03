<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-position="top"
    class="max-w-xl mx-auto space-y-4"
    @submit.prevent="onSubmit"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="First Name" prop="firstName">
          <el-input v-model="form.firstName" placeholder="Enter first name" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Last Name" prop="lastName">
          <el-input v-model="form.lastName" placeholder="Enter last name" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email" placeholder="Enter email" />
    </el-form-item>

    <el-form-item label="Password" prop="password">
      <el-input
        v-model="form.password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Enter password"
      >
        <template #suffix>
          <el-icon class="cursor-pointer" @click="togglePasswordVisibility">
            <component :is="showPassword ? Eye : EyeOff" />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item>
      <div class="flex space-x-3 w-full">
        <el-button
          type="primary"
          native-type="submit"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Continue
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { Eye, EyeOff } from "lucide-vue-next";
import { ref } from "vue";

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const formRef = ref();

const rules = {
  firstName: [
    { required: true, message: "First name is required", trigger: "blur" },
  ],
  lastName: [
    { required: true, message: "Last name is required", trigger: "blur" },
  ],
  email: [
    { required: true, message: "Email is required", trigger: "blur" },
    { type: "email", message: "Enter a valid email", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Password is required", trigger: "blur" },
    {
      min: 6,
      message: "Password must be at least 6 characters",
      trigger: "blur",
    },
  ],
};

const showPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const emit = defineEmits<{
  (
    e: "next-step",
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ): void;
}>();

const onSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      emit("next-step", { ...form.value });
    }
  });
};
</script>
