<script setup lang="ts">
import type { MetadataImages } from "~/types/common";

const props = defineProps<{
  src: string;
  srcset?: MetadataImages | null;
  loading?: HTMLImageElement["loading"];
  sizes?: HTMLImageElement["sizes"];
  draggable?: HTMLImageElement["draggable"];
}>();

const imgSrc = joinSrc(props.src);
const imgSrcset = props.srcset ? joinSrcset(props.srcset) : undefined;
</script>

<template>
  <img
    :src="imgSrc"
    :srcset="imgSrcset"
    :sizes
    :draggable
    :loading="loading ?? 'lazy'"
  />
</template>
