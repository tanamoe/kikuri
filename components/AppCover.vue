<script setup lang="ts">
import { ReleaseCalendarResponse, TitleResponse } from "@/types/pb";

const runtimeConfig = useRuntimeConfig();

defineProps<{
  book: ReleaseCalendarResponse<{
    title: TitleResponse;
  }>;
  sizes?: string;
}>();
</script>

<template>
  <img
    v-if="book.base_cover.length > 0"
    loading="lazy"
    class="aspect-[2/3] h-full w-full object-cover"
    :src="`${runtimeConfig.public.image_endpoint}/${book.collectionId}/${book.id}/${book.base_cover[0]}`"
    :sizes="sizes"
  />
  <img
    v-else-if="book.cover.length > 0"
    loading="lazy"
    class="aspect-[2/3] h-full w-full object-cover"
    :src="`${runtimeConfig.public.image_endpoint}/${book.collectionId}/${book.id}/${book.cover[0]}`"
    :sizes="sizes"
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
    {{ book.name }}
  </div>
</template>
