<template>
  <NuxtLink :to="`/company/${company.id}`" class="block">
    <el-card
      shadow="hover"
      class="transition-transform duration-200 hover:-translate-y-0.5 border border-gray-200"
      :body-style="{ padding: '0' }"
    >
      <div class="h-0.5 w-full bg-blue-500" />

      <div class="p-4">
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h2 class="font-semibold text-gray-900 text-lg truncate">
                {{ company.name }}
              </h2>
              <el-tag type="info" size="small" class="capitalize">
                ID: {{ company.id?.slice(0, 6) }}
              </el-tag>
            </div>
            <p class="text-sm text-gray-500 truncate">
              {{ company.address?.street || "No address" }},
              {{ company.address?.city || "" }}
            </p>
          </div>
          <el-icon class="text-gray-400 ml-2"><ArrowRight /></el-icon>
        </div>

        <div class="grid grid-cols-2 gap-4 text-center mb-4">
          <div>
            <el-icon class="mb-1 text-gray-400"><UserFilled /></el-icon>
            <p class="text-xs text-gray-500">Users</p>
            <p class="text-sm font-semibold text-gray-900">
              {{ company.users?.length }}
            </p>
          </div>
          <div>
            <el-icon class="mb-1 text-gray-400"><Location /></el-icon>
            <p class="text-xs text-gray-500">Sites</p>
            <p class="text-sm font-semibold text-gray-900">
              {{ company.sites?.length }}
            </p>
          </div>
        </div>

        <div
          class="flex justify-between items-center pt-3 border-t border-gray-100 text-xs text-gray-500"
        >
          <span
            >Created:
            {{ new Date(company.createdAt).toLocaleDateString() }}</span
          >
          <span
            >Updated:
            {{ new Date(company.updatedAt).toLocaleDateString() }}</span
          >
        </div>
      </div>
    </el-card>
  </NuxtLink>
</template>

<script setup>
import { ArrowRight, Location,UserFilled } from "@element-plus/icons-vue";

const props = defineProps({
  company: {
    type: Object as PropType<CompanyResponseDto>,
    required: true,
  },
});

const company = computed(() => props.company);
</script>
