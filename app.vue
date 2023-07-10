<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: "dark:bg-gray-900 bg-gray-50 text-gray-700 dark:text-gray-200",
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />

    <UNotifications />
  </NuxtLayout>
</template>
