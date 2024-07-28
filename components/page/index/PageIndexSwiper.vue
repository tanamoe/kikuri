<script setup lang="ts">
import type SwiperClass from "swiper";
import type { BooksCommon } from "@/types/common";

defineProps<{
  books: BooksCommon[];
}>();

const index = ref(0);
const swiperEl = ref();
</script>

<template>
  <UContainer class="overflow-y-hidden sm:h-fit">
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
          <PageIndexSwiperInfo :key="index" :book="books[index]" />
        </Transition>
      </div>

      <Swiper
        ref="swiperEl"
        class="w-64"
        :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperMousewheel]"
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
        :mousewheel="true"
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
        @slide-change="(swiper: SwiperClass) => (index = swiper.activeIndex)"
      >
        <SwiperSlide
          v-for="book in books"
          :key="book.id"
          class="relative overflow-hidden"
        >
          <PageIndexSwiperCard :book />
        </SwiperSlide>
      </Swiper>
    </div>
  </UContainer>
</template>
