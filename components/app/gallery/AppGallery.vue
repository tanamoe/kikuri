<script setup lang="ts">
const props = defineProps<{
  items: {
    alt: string;
    src: string;
    srcset: string;
  }[];
}>();

const store = useGalleryStore();
const { open } = store;
const { images } = storeToRefs(store);

images.value = props.items;
</script>

<template>
  <div class="grid grid-cols-2 gap-6 sm:grid-cols-4 xl:grid-cols-6">
    <AppCard
      v-for="(image, i) in images"
      :key="i"
      class="cursor-zoom-in"
      @click="open(i)"
    >
      <img
        loading="lazy"
        class="aspect-[2/3] h-full w-full object-cover transition-all hover:brightness-90 dark:hover:brightness-75"
        :src="image.src"
        :srcset="image.srcset"
        sizes="(max-width: 640px) 40vw, (max-width: 768px) 20vw, 15vw"
        v-bind="$attrs"
      />
    </AppCard>

    <AppGalleryLightbox />
  </div>
</template>
