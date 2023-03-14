<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const image = cva("w-full h-full", {
  variants: {
    fit: {
      full: "object-cover",
    },
  },
});

const placeholder = cva([
  "flex h-full w-full items-center justify-center text-center",
  "bg-zinc-200 text-zinc-500",
  "dark:bg-zinc-700 dark:text-zinc-400",
  "font-kanit font-bold",
  "p-6",
  "aspect-[2/3]",
]);

type AppCoverProps = VariantProps<typeof image> &
  VariantProps<typeof placeholder>;

defineProps<{
  entry: {
    name: string;
    image_url: string | null;
  };
  fit?: AppCoverProps["fit"];
  sizes?: string;
}>();
</script>

<template>
  <nuxt-img
    v-if="entry.image_url"
    provider="imagor"
    loading="lazy"
    :placeholder="[20, 30, 10]"
    :src="entry.image_url"
    :class="image({ fit })"
    :sizes="sizes"
  />
  <div v-else :class="placeholder()">{{ entry.name }}</div>
</template>
