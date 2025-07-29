<script setup lang="ts">
import type { MetadataImages } from "@/types/common";
import type { AssetsResponse } from "@/types/pb";

const props = defineProps<{
  assets: AssetsResponse<MetadataImages>[];
}>();

const assets = computed(() =>
  Array.from(
    new Array(24),
    (_, i) =>
      props.assets.filter((asset) => asset.resizedImage)?.[
        i % props.assets.length
      ],
  ),
);
</script>

<template>
  <div class="rotate-12">
    <div
      class="animate-scrolling grid grid-cols-4 gap-6 pb-6 md:grid-cols-6 xl:grid-cols-8"
    >
      <AppImage
        v-for="asset in assets"
        :key="asset.id"
        class="h-full w-full rounded-md object-cover"
        :src="asset.resizedImage!['1920w']"
        :srcset="asset.resizedImage"
        sizes="10vw"
      />
    </div>

    <div
      aria-hidden
      class="animate-scrolling grid grid-cols-4 gap-6 pb-6 md:grid-cols-6 xl:grid-cols-8"
    >
      <AppImage
        v-for="asset in assets"
        :key="asset.id"
        class="h-full w-full rounded-md object-cover"
        :src="asset.resizedImage!['1920w']"
        :srcset="asset.resizedImage"
        sizes="10vw"
      />
    </div>
  </div>
</template>
