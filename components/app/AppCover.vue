<script setup lang="ts">
import type { MetadataImages } from "@/types/common";

defineProps<{
  name?: string;
  src?: string;
  srcset?: MetadataImages;
}>();
</script>

<template>
  <AppImage
    v-if="src"
    class="aspect-[2/3] h-full w-full object-cover"
    :src="src"
    :srcset="srcset"
    :alt="name"
  />
  <div
    v-else
    :class="[
      'flex h-full w-full items-center justify-center text-center',
      'bg-gray-200 text-gray-500',
      'dark:bg-gray-800 dark:text-gray-400',
      'font-condensed font-bold',
      'p-6',
      'aspect-[2/3]',
    ]"
  >
    <span v-if="name">{{ name }}</span>
    <span v-else>{{ $t("general.tba") }}</span>
  </div>
</template>
