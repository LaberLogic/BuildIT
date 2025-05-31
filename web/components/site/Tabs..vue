<template>
  <el-tabs v-model="activeTab">
    <div class="grid w-full grid-cols-3 mb-4 rounded-lg bg-gray-100 p-1">
      <el-button
        v-for="tab in tabs"
        :key="tab.value"
        class="rounded-md"
        :class="{
          'bg-white shadow-sm': activeTab === tab.value,
        }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </el-button>
    </div>

    <el-tab-pane name="time">
      <site-time-tracker :site-id="id" :time-entries="timeEntries" />
    </el-tab-pane>

    <el-tab-pane name="materials">
      <site-material-tracker :site-id="id" :materials="site.materials.items" />
    </el-tab-pane>

    <el-tab-pane name="details">
      <site-details-card />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref } from "vue";

const activeTab = ref("materials");

const tabs = [
  { label: "Time Tracking", value: "time" },
  { label: "Materials", value: "materials" },
  { label: "Details", value: "details" },
];

const props = defineProps({
  id: String,
  timeEntries: Array,
  site: Object,
});
</script>
