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
    class="absolute top-2 right-2 z-20 text-neutral-900"
    color="error"
  >
    Digital
  </UBadge>
  <UBadge
    v-if="book.edition !== ''"
    class="absolute top-2 right-2 z-20 text-neutral-900"
    color="secondary"
  >
    {{ book.edition }}
  </UBadge>
  <div
    class="absolute inset-0 bg-gradient-to-t from-neutral-50 to-transparent to-50% sm:hidden dark:from-neutral-900"
  />
  <AppImageCover
    class="rounded-md"
    :name="book.expand?.publication.name"
    :src="image && $pb.files.getURL(image, image.image)"
    :srcset="image && image.resizedImage"
    sizes="(max-width: 640px) 80vw, (max-width: 1280px) 30vw, 15vw"
  />
</template>
