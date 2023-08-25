<script setup lang="ts">
import type { BaseSystemFields } from "types/pb";

const props = defineProps<{
  images: (Pick<BaseSystemFields, "id" | "collectionId"> & {
    cover: string[];
  })[];
}>();

const parsedImages = computed(() => {
  const images: string[] = [];

  props.images.map((image) =>
    image.cover.map((cover) =>
      images.push(getPocketBaseImagePath(image, cover)),
    ),
  );

  return images;
});

const isOpen = ref(false);
const currentIndex = ref(0);

const handleOpen = (i: number) => {
  isOpen.value = true;
  currentIndex.value = i;
};
</script>

<template>
  <div class="grid grid-cols-2 gap-6 sm:grid-cols-4 xl:grid-cols-6">
    <AppCard
      v-for="(cover, i) in parsedImages"
      :key="cover"
      class="cursor-zoom-in"
      @click="handleOpen(i)"
    >
      <NuxtImg
        loading="lazy"
        class="aspect-[2/3] h-full w-full object-cover"
        :src="cover"
        sizes="sm:50vw md:30vw lg:20vw"
      />
    </AppCard>

    <AppGallery
      v-model="isOpen"
      v-model:current-index="currentIndex"
      :images="parsedImages"
    />
  </div>
</template>
