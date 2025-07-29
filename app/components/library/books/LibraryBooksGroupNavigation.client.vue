<script setup lang="ts">
import type { CollectionBookResponse } from "@/types/api/collections";

const props = defineProps<{
  groups: Partial<Record<string, CollectionBookResponse[]>>;
}>();

const sections = computed(() =>
  Object.entries(props.groups).map(([key]) => ({
    label: key,
    click: () =>
      document.getElementById(key)?.scrollIntoView({ behavior: "smooth" }),
  })),
);

const horizontalUi = {
  container: "min-w-fit",
  active: "after:bg-transparent dark:after:bg-transparent",
  label: "overflow-visible text-clip whitespace-nowrap relative",
};

const ui = {
  active:
    "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:before:bg-neutral-50 dark:hover:before:bg-neutral-800/50 before:bg-transparent dark:before:bg-transparent",
  inactive:
    "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:before:bg-neutral-50 dark:hover:before:bg-neutral-800/50",
};
</script>

<template>
  <UHorizontalNavigation
    class="block sm:hidden"
    :links="sections"
    :ui="horizontalUi"
  />
  <UVerticalNavigation class="hidden sm:block" :links="sections" :ui />
</template>
