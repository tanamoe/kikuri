<script setup lang="ts">
import type { MetadataImages } from "~/types/common";

const props = defineProps<{
  src: string;
  srcset?: MetadataImages;
}>();

const imgSrc = computed(() => joinSrc(props.src));
const imgSrcset = computed(() =>
  props.srcset ? joinSrcset(props.srcset) : undefined,
);
</script>

<template>
  <img loading="lazy" :src="imgSrc" :srcset="imgSrcset" />
</template>
