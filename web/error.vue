<template>
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

  <section
    class="flex flex-col justify-center items-center min-h-[70vh] text-center px-4"
  >
    <h1 class="text-9xl font-extrabold text-blue-500 mb-6 select-none">404</h1>
    <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
      Oops! Page Not Found
    </h2>
    <p class="text-gray-600 max-w-md mb-8">
      The page you’re looking for doesn’t exist or has been moved. Check the URL
      or head back home.
    </p>

    <NuxtLink to="/" class="inline-block">
      <el-button
        type="primary"
        size="large"
        class="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 font-semibold shadow-lg transition-all"
      >
        Go to Homepage
        <ArrowRight class="h-5 w-5 ml-2" />
      </el-button>
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { ElButton } from "element-plus";
import { ArrowRight, Building2 } from "lucide-vue-next";

definePageMeta({
  layout: "auth",
});
</script>
