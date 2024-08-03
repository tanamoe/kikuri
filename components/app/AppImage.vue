<script setup lang="ts">
import type { MetadataImages } from "~/types/common";

const props = defineProps<{
  src: string;
  srcset?: MetadataImages | null;
}>();

const imgSrc = joinSrc(props.src);
const imgSrcset = props.srcset ? joinSrcset(props.srcset) : undefined;
</script>

<template>
  <img loading="lazy" :src="imgSrc" :srcset="imgSrcset" />
</template>
