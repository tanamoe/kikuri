<script setup lang="ts">
import type { BooksCommon } from "@/types/common";
import { Autoplay, EffectCreative, Mousewheel } from "swiper/modules";

defineProps<{
  books: BooksCommon[];
}>();

const index = ref(0);
const swiperEl = ref();
useSwiper(swiperEl, {
  injectStyles: [".swiper { overflow: visible };"],
  modules: [Autoplay, EffectCreative, Mousewheel],
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  slidesPerView: 1,
  rewind: true,
  effect: "creative",
  grabCursor: true,
  speed: 300,
  observer: true,
  observeParents: true,
  watchSlidesProgress: true,
  mousewheel: true,
  creativeEffect: {
    perspective: true,
    limitProgress: 2,
    shadowPerProgress: true,
    prev: {
      shadow: true,
      translate: ["-10%", 0, -200],
      rotate: [0, 0, -2],
    },
    next: {
      shadow: false,
      translate: ["120%", 0, 0],
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onSlideChange(swiper: any) {
  index.value = swiper.target.swiper.activeIndex;
}
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
          <PageIndexSwiperInfo :key="index" :book="books[index]!" />
        </Transition>
      </div>

      <ClientOnly>
        <swiper-container
          ref="swiperEl"
          class="w-64 xl:w-80"
          :init="false"
          @swiperslidechange="onSlideChange"
        >
          <swiper-slide
            v-for="book in books"
            :key="book.id"
            class="relative overflow-hidden"
          >
            <PageIndexSwiperCard :book />
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </div>
  </UContainer>
</template>
