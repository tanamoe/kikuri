<script setup lang="ts">
import { useSearchStore } from "@/stores/search";
const { metaSymbol } = useShortcuts();

const { open } = useSearchStore();
</script>

<template>
  <div>
    <UButton
      icon="i-fluent-search-20-filled"
      variant="ghost"
      color="gray"
      class="flex sm:hidden"
      square
      @click="open"
    />
    <UButton
      icon="i-fluent-search-20-filled"
      variant="solid"
      color="white"
      class="hidden sm:flex"
      :ui="{
        color: {
          white: {
            solid:
              'shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-400 bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',
          },
        },
      }"
      @click="open"
    >
      {{ $t("general.searchPlaceholder") }}
      <template #trailing>
        <div class="flex items-center gap-0.5">
          <UKbd>{{ metaSymbol }}</UKbd>
          <UKbd>K</UKbd>
        </div>
      </template>
    </UButton>
  </div>
</template>
