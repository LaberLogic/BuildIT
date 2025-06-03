<template>
  <nav class="border-b bg-white sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
      <div class="flex items-center">
        <el-icon
          class="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3"
        >
          <Building2 class="h-6 w-6 text-white" />
        </el-icon>
        <span class="text-2xl font-bold text-gray-900">Construxx</span>
      </div>
      <div class="flex items-center space-x-4">
        <el-button tag="nuxt-link" to="/auth/login" class="p-0">
          Sign In
        </el-button>
        <el-button
          type="primary"
          tag="nuxt-link"
          to="/auth/register"
          class="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Get Started
        </el-button>
      </div>
    </div>
  </nav>

  <section class="bg-gradient-to-br from-blue-50 to-white py-24">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <h1 class="text-5xl font-bold text-gray-900 mb-6">
        Construction Management
        <span class="block text-blue-500">Made Simple</span>
      </h1>
      <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Streamline your construction projects with our comprehensive management
        platform. Track progress, manage teams, and stay on schedule with
        Construxx.
      </p>

      <div
        class="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
      >
        <NuxtLink to="/auth/register" class="w-full sm:w-auto">
          <el-button
            size="large"
            type="primary"
            class="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg flex items-center justify-center gap-2 w-full"
          >
            Start Free Trial
            <ArrowRight class="h-5 w-5" />
          </el-button>
        </NuxtLink>

        <NuxtLink to="/auth/login" class="w-full sm:w-auto">
          <el-button
            size="large"
            type="default"
            class="px-8 py-4 text-lg w-full"
          >
            Sign In
          </el-button>
        </NuxtLink>
      </div>

      <p class="text-sm text-gray-500 mt-4">
        No credit card required • 14-day free trial
      </p>
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
