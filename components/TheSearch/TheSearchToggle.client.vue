<script setup lang="ts">
import { useSearchStore } from "@/stores/search";

const { open } = useSearchStore();

const platform = window.navigator.platform;
</script>

<template>
  <button
    class="flex items-center gap-3 rounded-xl border-2 border-zinc-400 px-3 py-1 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
    @click="open"
  >
    <Icon name="bi:search" />
    Tìm kiếm
    <span class="hidden items-center gap-1 sm:flex">
      <AppBadge class="h-5 dark:bg-zinc-700 dark:text-zinc-50">
        <Icon v-if="platform === 'MacIntel'" name="bi:command" />
        <span v-else>CTRL</span>
      </AppBadge>
      <AppBadge class="h-5 dark:bg-zinc-700 dark:text-zinc-50">K</AppBadge>
    </span>
  </button>
</template>
