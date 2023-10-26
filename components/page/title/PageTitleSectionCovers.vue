<script setup lang="ts">
import { Collections } from "@/types/pb";

import type { TitleCoversCommon } from "@/types/common";

const props = defineProps<{
  titleId: string;
}>();

const { $pb } = useNuxtApp();

const { data: images } = await useAsyncData(
  () =>
    $pb.collection(Collections.TitleCovers).getFullList<TitleCoversCommon>({
      filter: `title='${props.titleId}'`,
    }),
  {
    transform: (images) =>
      images.reduce((r, { parentCollection, id, covers, title, metadata }) => {
        if (parentCollection && covers) {
          for (const i in covers) {
            r.push({
              alt: title,
              src: $pb.files.getUrl(
                {
                  id,
                  collectionName: parentCollection,
                },
                covers[i],
              ),
              srcset:
                metadata && Array.isArray(metadata.images)
                  ? joinSrcset(metadata.images[i])
                  : undefined,
            });
          }
        }
        return r;
      }, [] as any[]),
  },
);
</script>

<template>
  <div v-if="images && images.length > 0">
    <AppH3 class="mb-3 mt-12">{{ $t("general.coverImages") }}</AppH3>

    <AppGallery :items="images" />
  </div>
</template>
