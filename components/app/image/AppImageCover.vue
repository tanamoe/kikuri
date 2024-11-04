<script setup lang="ts">
import type { MetadataImages } from "@/types/common";

interface Props {
  aspect?: "2/3" | "full";
  name?: string;
  src?: string | null;
  srcset?: MetadataImages | null;
  loading?: HTMLImageElement["loading"];
  sizes?: HTMLImageElement["sizes"];
  draggable?: HTMLImageElement["draggable"];
}

defineProps<Props>();
</script>

<template>
  <AppImage
    v-if="src"
    class="h-full w-full object-cover"
    :class="aspect === 'full' ? '' : 'aspect-[2/3]'"
    :src="src"
    :srcset="srcset"
    :title="name"
    :alt="name"
    :sizes
    :draggable
    :loading
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
      'overflow-hidden',
    ]"
  >
    <span v-if="name">{{ name }}</span>
    <span v-else>{{ $t("general.tba") }}</span>
  </div>
</template>
