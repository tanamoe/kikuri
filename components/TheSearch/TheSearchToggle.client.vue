<script setup lang="ts">
import { useSearchStore } from "@/stores/search";

const { open } = useSearchStore();

const platform = window.navigator.platform;
</script>

<template>
  <button
    class="flex items-center gap-3 rounded-xl border-2 border-neutral-400 py-1 px-3 dark:border-neutral-700"
    @click="open"
  >
    <Icon name="bi:search" />
    Tìm kiếm
    <span class="hidden items-center gap-1 sm:flex">
      <AppBadge class="h-5 dark:bg-neutral-700 dark:text-neutral-50">
        <Icon v-if="platform === 'MacIntel'" name="bi:command" />
        <span v-else>CTRL</span>
      </AppBadge>
      <AppBadge class="h-5 dark:bg-neutral-700 dark:text-neutral-50"
        >K</AppBadge
      >
    </span>
  </button>
</template>
