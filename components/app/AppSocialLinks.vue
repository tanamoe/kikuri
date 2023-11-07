<script setup lang="ts">
const appConfig = useAppConfig();
</script>

<template>
  <ul class="flex items-center gap-1">
    <li v-for="social in appConfig.tana.socials" :key="social.name">
      <UButton
        :icon="social.icon"
        :to="social.url"
        target="_blank"
        color="gray"
        variant="ghost"
        size="sm"
        square
        :aria-label="social.name"
      />
    </li>
  </ul>
</template>
