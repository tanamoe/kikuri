<script setup lang="ts">
import { parseURL } from "ufo";
import type { MetadataImages } from "~/types/common";

const props = defineProps<{
  src: string;
  srcset?: MetadataImages | null;
  loading?: HTMLImageElement["loading"];
  sizes?: HTMLImageElement["sizes"];
  draggable?: HTMLImageElement["draggable"];
}>();

const src = computed(() =>
  !parseURL(props.src).host ? joinSrc(props.src) : props.src,
);

const srcset = computed(() =>
  props.srcset ? joinSrcset(props.srcset) : undefined,
);
</script>

<template>
  <img :src :srcset :sizes :draggable :loading="loading ?? 'lazy'" />
</template>
