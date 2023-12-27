<script setup lang="ts">
const ui = {
  block: "gap-2.5",
  padding: {
    md: "px-3 py-2.5",
  },
  color: {
    gray: {
      solid:
        "ring-0 bg-gray-200 dark:bg-gray-700 hover:bg-gray-200/75 dark:hover:bg-gray-700/50",
    },
  },
};
</script>

<template>
  <UButton color="gray" block :ui="ui" size="md">
    <div class="flex-1 text-center">
      <slot />
    </div>
  </UButton>
</template>
