<script setup lang="ts">
const props = defineProps<{
  items: {
    alt?: string;
    src: string;
    srcset?: string;
  }[];
}>();

const store = useGalleryStore();
const { open } = store;
const { images } = storeToRefs(store);

watchEffect(() => {
  images.value = props.items;
});

const ui = {
  base: "relative overflow-hidden cursor-zoom-in",
  shadow: "shadow",
  body: {
    padding: "p-0 sm:p-0",
  },
};
</script>

<template>
  <div class="grid grid-cols-2 gap-6 sm:grid-cols-4 xl:grid-cols-6">
    <UCard v-for="(image, i) in images" :key="i" :ui="ui" @click="open(i)">
      <img
        loading="lazy"
        class="aspect-[2/3] h-full w-full object-cover transition-all hover:brightness-90 dark:hover:brightness-75"
        :src="image.src"
        :srcset="image.srcset"
        sizes="(max-width: 640px) 40vw, (max-width: 768px) 20vw, 15vw"
        v-bind="$attrs"
      />
    </UCard>

    <AppGalleryLightbox />
  </div>
</template>
