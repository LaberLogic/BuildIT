<template>
  <!-- Navbar -->
  <nav
    class="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm"
  >
    <div class="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
      <div class="flex items-center">
        <div
          class="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3 shadow-md"
        >
          <Building2 class="h-6 w-6 text-white" />
        </div>
        <span class="text-2xl font-bold text-gray-900">Construxx</span>
      </div>
      <div class="flex items-center space-x-3">
        <NuxtLink to="/auth/login">
          <el-button
            size="large"
            class="text-gray-700 hover:text-blue-500 transition-colors"
          >
            Sign In
          </el-button>
        </NuxtLink>
        <el-button
          type="primary"
          tag="nuxt-link"
          to="/auth/register"
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 shadow-md"
        >
          Get Started
        </el-button>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-blue-50 to-white py-32">
    <div class="max-w-5xl mx-auto px-4 text-center">
      <h1
        class="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
      >
        Construction Management
        <span class="block text-blue-500">Made Simple</span>
      </h1>
      <p class="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Streamline your construction projects with our powerful management
        platform. Track progress, manage teams, and hit every milestone with
        ease.
      </p>

      <div
        class="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
      >
        <NuxtLink to="/auth/register" class="w-full sm:w-auto">
          <el-button
            size="large"
            type="primary"
            class="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg font-semibold shadow-lg w-full transition-all"
          >
            Start Free Trial
            <ArrowRight class="h-5 w-5 ml-2" />
          </el-button>
        </NuxtLink>

        <NuxtLink to="/auth/login" class="w-full sm:w-auto">
          <el-button
            size="large"
            type="default"
            class="px-8 py-4 text-lg font-medium w-full border-gray-300 hover:border-blue-500 transition-all"
          >
            Sign In
          </el-button>
        </NuxtLink>
      </div>

      <p class="text-sm text-gray-500 mt-5">Uni Demo Version</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ElButton } from "element-plus";
import { ArrowRight, Building2 } from "lucide-vue-next";

definePageMeta({
  layout: "auth",
});
</script>
