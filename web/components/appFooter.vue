<template>
  <div
    class="fixed z-40 w-full bottom-0 bg-white border-t border-gray-200 px-4 flex items-center justify-center h-24"
  >
    <div class="w-80 flex justify-between items-center h-full text-gray-600">
      <NuxtLink v-for="item in navItems" :key="item.href" class="">
        <div
          class="hover:bg-gray-100 p-4 rounded-lg"
          :class="isActiveRoute(item.active)"
        >
          <el-icon :size="25">
            <component :is="item.icon"></component>
          </el-icon>
        </div>
      </NuxtLink>
    </div>
  </div>
  <div v-if="showBackButton" class="w-8"></div>
</template>

<script setup lang="ts">
import {
  User,
  OfficeBuilding,
  MessageBox,
  CirclePlus,
  Avatar,
} from "@element-plus/icons-vue";
const showBackButton = ref(true);

const route = useRoute();
const pathName = route.fullPath?.toString();
function isActiveRoute(isActive: boolean): string {
  return isActive ? "text-blue-400 bg-gray-50" : "";
}
console.log(pathName);
const navItems = [
  {
    href: "/",
    icon: OfficeBuilding,
    label: "Sites",
    active: pathName === "/" || pathName?.startsWith("/sites"),
  },
  {
    href: "/users",
    icon: User,
    label: "Users",
    active: pathName === "/users",
  },
  {
    href: "/chat",
    icon: MessageBox,
    label: "Chat",
    active: pathName === "/chat" || pathName?.startsWith("/chat"),
    badge: false,
  },
  {
    href: "/profile",
    icon: Avatar,
    label: "Profile",
    active: pathName === "/profile" || pathName === "/company",
  },
];
</script>
