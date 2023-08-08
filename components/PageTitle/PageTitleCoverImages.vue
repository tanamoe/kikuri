<script setup lang="ts">
import type { BaseSystemFields } from "types/pb";

defineProps<{
  images: (Pick<BaseSystemFields, "id" | "collectionId"> & {
    cover: string[];
  })[];
}>();
</script>

<template>
  <div class="grid grid-cols-2 gap-6 sm:grid-cols-4 xl:grid-cols-6">
    <template v-for="image in images" :key="image.id">
      <AppCard v-for="cover in image.cover" :key="cover">
        <NuxtImg
          loading="lazy"
          class="aspect-[2/3] h-full w-full object-cover"
          :src="getPockerBaseImagePath(image, cover)"
          sizes="sm:50vw md:30vw lg:20vw"
        />
      </AppCard>
    </template>
  </div>
</template>
