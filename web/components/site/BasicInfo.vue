<template>
  <div>
    <el-card
      v-if="site"
      shadow="hover"
      class="alert-bar"
      :body-style="{ padding: '0' }"
    >
      <div class="h-0.5 w-full bg-orange-400" />

      <div class="p-4">
        <div class="info-block text-gray-700 mb-3" data-cy="site-name">
          <span>{{ site.name }}</span>
        </div>
        <div class="info-block text-gray-700 mb-3" data-cy="site-address">
          <el-icon class="mr-2"><MapPin /></el-icon>
          <span>{{ site.address }}</span>
          <el-button
            v-if="isAdminOrManager"
            class="btn-icon ml-auto text-gray-500"
            data-cy="site-edit-button"
            @click="editOpen = true"
          >
            <el-icon><Edit /></el-icon>
          </el-button>
        </div>

        <el-alert
          v-if="site?.materialInfo?.warnings > 0"
          type="warning"
          show-icon
          :title="`${site?.materialInfo.warnings} material${site.materialInfo.warnings > 1 ? 's' : ''} low or out of stock`"
          class="mb-4"
          data-cy="material-warning-alert"
        />

        <div class="mb-4">
          <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
          </div>
          <el-progress
            :percentage="site.progress"
            :stroke-width="8"
            data-cy="progress-bar"
          />
        </div>

        <div
          class="grid grid-cols-2 gap-4 text-sm text-gray-700"
          data-cy="site-info-grid"
        >
          <div class="info-block" data-cy="hours-logged">
            <el-icon class="mr-2"><Clock /></el-icon>
            <div>
              <p class="text-label">Hours Logged</p>
              <p class="info-value">{{ site.hoursLogged }}</p>
            </div>
          </div>

          <div class="info-block" data-cy="completion-date">
            <el-icon class="mr-2"><Calendar /></el-icon>
            <div>
              <p class="text-label">Completion</p>
              <p class="info-value">{{ useFormatDate(site.endDate) }}</p>
            </div>
          </div>

          <div class="info-block" data-cy="workers-count">
            <el-icon class="mr-2"><Users /></el-icon>
            <div>
              <p class="text-label">Workers</p>
              <p class="info-value">{{ site.assignments?.length }}</p>
            </div>
          </div>

          <div class="info-block" data-cy="start-date">
            <el-icon class="mr-2"><Calendar /></el-icon>
            <div>
              <p class="text-label">Start Date</p>
              <p class="info-value">{{ useFormatDate(site.startDate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <site-modals-create-update-site
      v-if="isAdminOrManager"
      v-model="editOpen"
      :site="site"
      :users="users"
      @close="editOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { Calendar, Clock, Edit, MapPin, Users } from "lucide-vue-next";
import type { SiteResponseDto } from "shared";

import { useCompanyStore } from "../../stores/company";

const props = defineProps({
  site: {
    type: Object as PropType<SiteResponseDto>,
    required: true,
  },
});

const companyStore = useCompanyStore();
const authStore = useAuthStore();

const route = useRoute();
const companyId = route.params.companyId as string;

const site = computed(() => props.site);
const users = computed(() => companyStore.users);
const isAdminOrManager = computed(() => authStore.isManagerOrAdmin);

companyStore.fetchUsers(companyId);

const editOpen = ref(false);
</script>
