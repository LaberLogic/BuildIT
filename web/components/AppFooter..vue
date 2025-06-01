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
  User,
  OfficeBuilding,
  MessageBox,
  Avatar,
} from "@element-plus/icons-vue";

import { useRoute } from "vue-router";

const route = useRoute();

const auth = useAuthStore();
const user = computed(() => auth.user);

const allNavItems = [
  {
    href: "/",
    icon: OfficeBuilding,
    label: "Sites",
    roles: ["ADMIN", "MANAGER", "WORKER"],
  },
  {
    href: "/users",
    icon: User,
    label: "Users",
    roles: ["ADMIN", "MANAGER"],
  },
  {
    href: "/chat",
    icon: MessageBox,
    label: "Chat",
    badge: false,
    roles: ["SUPER ADMIN"],
  },
  {
    href: "/profile",
    icon: Avatar,
    label: "Profile",
    roles: ["ADMIN", "MANAGER", "WORKER"],
  },
];

const navItems = computed(() =>
  allNavItems.filter((item) =>
    item.roles.includes(user?.value?.role ?? "FAILED"),
  ),
);

const isActiveRoute = (itemHref: string) => {
  return route.path === itemHref || route.path.startsWith(itemHref + "/");
};
</script>
