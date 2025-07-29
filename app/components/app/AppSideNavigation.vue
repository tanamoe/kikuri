<script setup lang="ts">
defineProps<{
  links: {
    authenticated?: boolean;
    icon?: string;
    label: string;
    to?: string;
    click?: () => void;
  }[][];
}>();
</script>

<template>
  <div class="flex gap-3 overflow-x-scroll whitespace-nowrap sm:flex-col">
    <div v-for="(group, i) in links" :key="i" class="flex gap-1 sm:flex-col">
      <template v-for="link in group" :key="link.to">
        <UButton
          v-if="
            typeof link.authenticated !== 'undefined'
              ? link.authenticated === $pb.authStore.isAuthRecord
              : true
          "
          active-class="bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          :to="link.to"
          :icon="link.icon"
          color="neutral"
          variant="ghost"
          @click="link.click"
        >
          {{ link.label }}
        </UButton>
      </template>
    </div>
  </div>
</template>
