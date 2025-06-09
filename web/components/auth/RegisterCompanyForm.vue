<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-position="top"
    class="max-w-2xl mx-auto space-y-4"
    @submit.prevent="handleSubmit"
  >
    <el-form-item label="Company Name" prop="companyName">
      <el-input
        v-model="form.companyName"
        placeholder="Your Construction Company"
      />
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="14">
        <el-form-item label="Street" prop="address.street">
          <el-input v-model="form.address.street" placeholder="Main Street" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="Street Number" prop="address.streetNumber">
          <el-input v-model="form.address.streetNumber" placeholder="123" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="City" prop="address.city">
          <el-input v-model="form.address.city" placeholder="New York" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Postal Code" prop="address.postalCode">
          <el-input v-model="form.address.postalCode" placeholder="10001" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="Country" prop="address.country">
      <el-input v-model="form.address.country" placeholder="United States" />
    </el-form-item>

    <el-form-item class="mb-4">
      <div class="flex space-x-3 w-full">
        <el-button
          type="default"
          class="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
          @click="handleBack"
        >
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back
        </el-button>

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
import { ArrowLeft } from "@element-plus/icons-vue";

const formRef = ref();

const form = ref({
  companyName: "",
  address: {
    streetNumber: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  },
});

const rules = {
  companyName: [
    { required: true, message: "Company name is required", trigger: "blur" },
  ],
  "address.streetNumber": [
    { required: true, message: "Street number is required", trigger: "blur" },
  ],
  "address.street": [
    { required: true, message: "Street is required", trigger: "blur" },
  ],
  "address.city": [
    { required: true, message: "City is required", trigger: "blur" },
  ],
  "address.postalCode": [
    { required: true, message: "Postal code is required", trigger: "blur" },
  ],
  "address.country": [
    { required: true, message: "Country is required", trigger: "blur" },
  ],
};

const emit = defineEmits<{
  (
    e: "next-step",
    payload: {
      companyName: string;
      address: {
        streetNumber: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
      };
    },
  ): void;
  (e: "previous-step"): void;
}>();

const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      emit("next-step", { ...form.value });
    }
  });
};

const handleBack = () => {
  emit("previous-step");
};
</script>
