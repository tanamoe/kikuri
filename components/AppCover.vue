<script setup lang="ts">
defineProps<{
  entry: {
    name: string;
    image_url: string | null;
  };
  sizes?: string;
}>();
</script>

<template>
  <nuxt-img
    v-if="entry.image_url"
    provider="imagor"
    loading="lazy"
    class="aspect-[2/3] h-full w-full object-cover"
    :placeholder="[20, 30, 10]"
    :src="entry.image_url"
    :sizes="sizes"
  />
  <div
    v-else
    :class="[
      'flex h-full w-full items-center justify-center text-center',
      'bg-zinc-200 text-zinc-500',
      'dark:bg-zinc-700 dark:text-zinc-400',
      'font-bold',
      'p-6',
      'aspect-[2/3]',
    ]"
  >
    {{ entry.name }}
  </div>
</template>
