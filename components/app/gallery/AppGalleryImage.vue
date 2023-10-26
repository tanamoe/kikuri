<script setup lang="ts">
const store = useGalleryStore();
const { images, currentIndex } = storeToRefs(store);
</script>

<template>
  <img
    v-if="images"
    ref="modal"
    class="h-auto max-h-[80dvh] w-auto rounded-md"
    :src="images[currentIndex].src"
    draggable="false"
  />
</template>
