<script setup lang="ts">
import { Swiper, Autoplay, EffectCreative } from "swiper";
import "swiper/css";
import "swiper/css/effect-creative";

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

const swiperEl = ref<Swiper>();

Swiper.use([Autoplay, EffectCreative]);

onMounted(() => {
  swiperEl.value = new Swiper(".swiper-container", {
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    slidesPerView: 1,
    rewind: true,
    effect: "creative",
    grabCursor: true,
    watchSlidesProgress: true,
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
    speed: 300,
    observer: true,
    observeParents: true,
  });

  swiperEl.value.on("slideChange", (swiper) => {
    emit("slideChange", swiper.activeIndex);
  });
});

defineExpose({
  swiperEl,
});
</script>

<template>
  <div ref="swiperEl" class="swiper-container">
    <div class="swiper-wrapper">
      <div v-for="entry in data" :key="entry.id" class="swiper-slide">
        <AppCard>
          <AppCover :entry="entry" sizes="sm:90vw md:20vw" />
        </AppCard>
      </div>
    </div>
  </div>
</template>
