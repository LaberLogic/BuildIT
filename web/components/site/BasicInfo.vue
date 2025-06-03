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
        <div class="info-block text-gray-700 mb-3">
          <el-icon class="mr-2"><MapPin /></el-icon>
          <span>{{ site.address }}</span>
          <el-button
            class="btn-icon ml-auto text-gray-500"
            @click="editOpen = true"
          >
            Edit
            <el-icon class="ml-1"><Edit /></el-icon>
          </el-button>
        </div>

        <el-alert
          v-if="site?.materialInfo?.warnings > 0"
          type="warning"
          show-icon
          :title="`${site?.materialInfo.warnings} material${site.materialInfo.warnings > 1 ? 's' : ''} low or out of stock`"
          class="mb-4"
        />

        <div class="mb-4">
          <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
          </div>
          <el-progress :percentage="site.progress" :stroke-width="8" />
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div class="info-block">
            <el-icon class="mr-2"><Clock /></el-icon>
            <div>
              <p class="text-label">Hours Logged</p>
              <p class="info-value">{{ site.hoursLogged }}</p>
            </div>
          </div>

          <div class="info-block">
            <el-icon class="mr-2"><Calendar /></el-icon>
            <div>
              <p class="text-label">Completion</p>
              <p class="info-value">{{ useFormatDate(site.endDate) }}</p>
            </div>
          </div>

          <div class="info-block">
            <el-icon class="mr-2"><Users /></el-icon>
            <div>
              <p class="text-label">Workers</p>
              <p class="info-value">{{ site.assignments?.length }}</p>
            </div>
          </div>

          <div class="info-block">
            <el-icon class="mr-2"><Calendar /></el-icon>
            <div>
              <p class="text-label">Start Date</p>
              <p class="info-value">{{ useFormatDate(site.startDate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <site-modals-update-site v-model="editOpen" :site="site" />
  </div>
</template>

<script setup lang="ts">
import { Calendar, Clock, Edit, MapPin, Users } from "lucide-vue-next";

const props = defineProps({
  site: {
    type: Object as PropType<SiteResponseDto>,
    required: true,
  },
});

const site = computed(() => props.site);

const editOpen = ref(false);
</script>
