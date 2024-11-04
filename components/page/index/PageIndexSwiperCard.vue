<script setup lang="ts">
import type { BooksCommon } from "~/types/common";

const props = defineProps<{
  book: BooksCommon;
}>();

const image = computed(() => {
  const _asset = props.book.expand?.assets_via_book?.find(
    (asset) => asset.type === "0000000000cover",
  );
  const _default =
    props.book.expand?.publication.expand?.defaultBook?.expand?.assets_via_book?.find(
      (asset) => asset.type === "0000000000cover",
    );
  return _asset ?? _default;
});
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
  />
  <AppImageCover
    class="rounded-md"
    :name="book.expand?.publication.name"
    :src="image && $pb.files.getUrl(image, image.image)"
    :srcset="image && image.resizedImage"
    sizes="(max-width: 640px) 80vw, (max-width: 1280px) 30vw, 15vw"
  />
</template>
