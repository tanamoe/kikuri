<script setup lang="ts">
import type { BooksCommon, MetadataImages } from "~/types/common";

const props = defineProps<{
  book: BooksCommon;
}>();

const _asset = props.book.expand?.assets_via_book?.find(
  (asset) => asset.type === "0000000000cover",
);
const _default =
  props.book.expand?.publication.expand?.defaultBook?.expand?.assets_via_book?.find(
    (asset) => asset.type === "0000000000cover",
  );
const image = (_asset ? _asset.resizedImage : _default?.resizedImage) as
  | MetadataImages
  | undefined;
</script>

<template>
  <UBadge
    v-if="book.expand?.publication.expand?.release.digital == true"
    class="absolute right-2 top-2 z-20 text-gray-900"
    color="red"
  >
    Digital
  </UBadge>
  <UBadge
    v-if="book.edition !== ''"
    class="absolute right-2 top-2 z-20 text-gray-900"
    color="tanaamber"
  >
    {{ book.edition }}
  </UBadge>
  <div
    class="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent to-50% sm:hidden dark:from-gray-900"
  ></div>
  <AppBookCover
    class="rounded-md"
    :name="book.expand?.publication.name"
    :src="image && image['1920w']"
    :srcset="image"
    sizes="(max-width: 640px) 80vw, 300px"
  />
</template>
