<template>
  <div class="flex flex-col h-screen">
    <app-header class="h-16 shrink-0" />

    <div class="flex-1 overflow-y-auto bg-gray-50">
      <slot />
    </div>

    <app-footer class="h-20 shrink-0" />
  </div>
</template>
