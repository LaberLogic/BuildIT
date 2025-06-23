<template>
  <div
    class="sticky z-10 top-0 bg-white border-b border-gray-200 px-4 flex items-center"
  >
    <h1 class="text-lg font-semibold text-gray-900 flex-1 text-center">
      {{ title }}
    </h1>

    <el-button
      v-if="showBackButton"
      size="small"
      class="ml-auto"
      @click="logout"
    >
      Logout
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const showBackButton = ref(true);
const title = "Construx";

const logout = () => {
  signOut();
};
</script>
