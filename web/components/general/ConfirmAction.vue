<template>
  <el-dialog :v-model="true" title="Warning" width="500" center>
    <span> Are you sure you want to delete this item ? </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">Cancel</el-button>
        <el-button
          type="primary"
          data-cy="confirm-action-button"
          @click="handleSave"
        >
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits(["update:modelValue", "save"]);

const onCancel = () => {
  emit("update:modelValue", false);
};

const handleSave = () => {
  emit("save");
  emit("update:modelValue", false);
};
</script>
