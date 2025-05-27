<template>
  <div
    class="sticky z-10 top-0 bg-white border-b border-gray-200 px-4 flex items-center"
  >
    <el-button
      v-if="showBackButton"
      link
      size="small"
      class="mr-2 -ml-2"
      @click="goBack"
    >
      <el-icon>
        <ArrowLeft class="text-gray-600 w-5 h-5" />
      </el-icon>
      <span class="sr-only">Back</span>
    </el-button>

    <h1 class="text-lg font-semibold text-gray-900 flex-1 text-center">
      {{ title }}
    </h1>

    <div v-if="showBackButton" class="w-8"></div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";

const showBackButton = ref(true);
const title = "Construx";
const goBack = () => {
  // Back navigation logic here
  console.log("Go back");
};
</script>
