<script setup lang="ts">
import {
  type BookDetailsResponse,
  type PublicationsResponse,
  type ReleasesResponse,
  type TitlesResponse,
} from "@/types/pb";
import type { MetadataCommon } from "@/types/common";

type Texpand = {
  publication: Pick<PublicationsResponse, "name">;
  release: Pick<
    ReleasesResponse<{
      title: TitlesResponse;
    }>,
    "expand" | "title"
  >;
};

defineProps<{
  releases: BookDetailsResponse<MetadataCommon, string, Texpand>[];
}>();

const index = ref(0);
const swiperEl = ref();
</script>

<template>
  <UContainer v-if="releases" class="overflow-y-hidden sm:h-fit">
    <div class="flex flex-col-reverse gap-12 overflow-hidden sm:flex-row">
      <div class="relative z-10 -mt-28 flex-1 sm:mt-12">
        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 translate-x-3"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 -translate-x-3"
        >
          <PageIndexSwiperInfo :key="index" :book="releases[index]" />
        </Transition>
      </div>

      <Swiper
        ref="swiperEl"
        class="w-64"
        :modules="[SwiperAutoplay, SwiperEffectCreative]"
        :autoplay="{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }"
        :slides-per-view="1"
        :rewind="true"
        :effect="'creative'"
        :grab-cursor="true"
        :speed="300"
        :observer="true"
        :observe-parents="true"
        :watch-slides-progress="true"
        :creative-effect="{
          perspective: true,
          limitProgress: 2,
          shadowPerProgress: true,
          prev: {
            shadow: true,
            translate: ['-10%', 0, -200],
            rotate: [0, 0, -2],
          },
          next: {
            shadow: false,
            translate: ['120%', 0, 0],
          },
        }"
        style="overflow: visible; margin-right: 0"
        @slide-change="(swiper) => (index = swiper.activeIndex)"
      >
        <SwiperSlide
          v-for="book in releases"
          :key="book.id"
          class="relative overflow-hidden"
        >
          <UBadge
            v-if="book.edition !== ''"
            class="absolute right-2 top-2 backdrop-blur"
            :ui="{
              variant: {
                solid: 'bg-amber-300 bg-opacity-50 text-gray-800',
              },
            }"
          >
            {{ book.edition }}
          </UBadge>
          <div
            class="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent to-50% dark:from-gray-900 sm:hidden"
          />
          <AppCover
            class="rounded-md"
            :name="book.expand?.publication.name"
            :src="
              book.metadata?.images && Array.isArray(book.metadata.images)
                ? book.metadata.images[0]['1920w']
                : undefined
            "
            :srcset="
              book.metadata?.images && Array.isArray(book.metadata.images)
                ? book.metadata.images[0]
                : undefined
            "
            sizes="(max-width: 640px) 80vw, 300px"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </UContainer>
</template>
