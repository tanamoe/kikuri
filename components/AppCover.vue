<script setup lang="ts">
import type { BaseSystemFields } from "@/types/pb";

defineProps<{
  book: Pick<BaseSystemFields, "id" | "collectionId"> & {
    name: string;
  };
  fileName?: string;
  sizes?: string;
}>();
</script>

<template>
  <NuxtImg
    v-if="fileName"
    loading="lazy"
    class="aspect-[2/3] h-full w-full object-cover"
    :src="getPocketBaseImagePath(book, fileName)"
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
