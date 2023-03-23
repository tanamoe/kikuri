<script setup lang="ts">
// TODO: remove, use types from GraphQL API
interface Entry {
  id: string;
  name: string;
  date: string;
  publisher: {
    id: string;
    name: string;
  };
  price: number;
  image_url: string | null;
  edition: string | null;
  serie_id: number | null;
}

const emit = defineEmits<{
  (e: "slideChange", index: number): void;
}>();

defineProps<{
  data: Entry[];
}>();
</script>

<template>
  <Swiper
    ref="swiperEl"
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
    style="overflow: visible"
    @slide-change="(swiper) => emit('slideChange', swiper.activeIndex)"
  >
    <SwiperSlide
      v-for="entry in data"
      :key="entry.id"
      class="overflow-hidden rounded-2xl"
    >
      <AppCover :entry="entry" sizes="sm:90vw md:20vw" />
    </SwiperSlide>
  </Swiper>
</template>
