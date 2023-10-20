<script setup lang="ts">
import { joinURL } from "ufo";
import { Collections, type TitleCoversResponse } from "@/types/pb";

const props = defineProps<{
  titleId: string;
}>();

const { $pb } = useNuxtApp();

const { data: images } = await useAsyncData(
  () =>
    $pb
      .collection(Collections.TitleCovers)
      .getFullList<TitleCoversResponse<string[], string, string, number>>({
        filter: `title='${props.titleId}'`,
      }),
  {
    transform: (images) =>
      images.reduce((r, { parentCollection, id, covers }) => {
        if (parentCollection && covers) {
          for (const cover of covers) {
            r.push(joinURL(parentCollection, id, cover));
          }
        }
        return r;
      }, [] as string[]),
  },
);

const isOpen = ref(false);
const currentIndex = ref(0);

const handleOpen = (i: number) => {
  isOpen.value = true;
  currentIndex.value = i;
};
</script>

<template>
  <div v-if="images && images.length > 0">
    <AppH3 class="mb-3 mt-12">{{ $t("general.coverImages") }}</AppH3>

    <div class="grid grid-cols-2 gap-6 sm:grid-cols-4 xl:grid-cols-6">
      <AppCard
        v-for="(image, i) in images"
        :key="i"
        class="cursor-zoom-in"
        @click="handleOpen(i)"
      >
        <NuxtImg
          loading="lazy"
          class="aspect-[2/3] h-full w-full object-cover"
          :src="image"
          sizes="sm:50vw md:30vw lg:20vw"
          :placeholder="[60, 90, 75, 5]"
        />
      </AppCard>

      <AppGallery
        v-model="isOpen"
        v-model:current-index="currentIndex"
        :images="images"
      />
    </div>
  </div>
</template>
