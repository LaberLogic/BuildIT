<template>
  <div
    class="fixed z-40 w-full bottom-0 bg-white border-t border-gray-200 px-4 flex items-center justify-center h-24"
  >
    <div
      class="fixed z-40 w-full bottom-0 bg-white border-t border-gray-200 px-4 flex items-center justify-center h-24"
    >
      <div
        class="flex justify-center items-center h-full text-gray-600 gap-x-12"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          :data-cy="item.label"
          class="flex flex-col justify-center items-center"
        >
          <div
            class="hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center"
            :class="{
              'text-blue-400 bg-gray-50': isActiveRoute(item.href),
            }"
          >
            <el-icon :size="25">
              <component :is="item.icon"></component>
            </el-icon>
            <span class="text-xs">{{ item.label }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Building2,
  Construction,
  MessageCircle,
  User,
  Users,
} from "lucide-vue-next";
import { useRoute } from "vue-router";

const route = useRoute();

const auth = useAuthStore();
const user = computed(() => auth.user);

const isAdmin = computed(() => user.value?.role === "ADMIN");

const navItems = computed(() => {
  if (!user.value) return [];

  const companyId = user.value.companyId;

  const items = [
    {
      href: "/company/",
      icon: Building2,
      label: "Companies",
      show: isAdmin.value,
    },
    {
      href: `/company/${companyId}/sites`,
      icon: Construction,
      label: "Sites",
      show: ["MANAGER", "WORKER"].includes(user.value.role),
    },
    {
      href: `/company/${companyId}/users`,
      icon: Users,
      label: "Users",
      show: ["MANAGER"].includes(user.value.role),
    },
    {
      href: "/chat",
      icon: MessageCircle,
      label: "Chat",
      show: user.value.role === "SUPER ADMIN",
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
      show: true,
    },
  ];

  return items.filter((item) => item.show);
});

const isActiveRoute = (itemHref: string) => {
  return route.path === itemHref || route.path.includes(itemHref + "/");
};
</script>
