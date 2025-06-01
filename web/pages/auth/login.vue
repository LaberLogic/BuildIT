<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center">
    <auth-header-with-icon :title="loginTitle" :subtitle="loginSubtitle" />
    <auth-login-form />
    <div class="text-center mt-6">
      <p class="text-sm text-gray-600">
        Don't have an account?
        <NuxtLink
          href="/auth/register"
          class="text-blue-500 hover:text-blue-600 font-medium"
        >
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
const loginTitle = "Welcome Back";

const loginSubtitle = "Sign in to your Construxx account";
</script>
