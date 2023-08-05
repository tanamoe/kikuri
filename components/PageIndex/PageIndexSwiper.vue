<script setup lang="ts">
import type { BookDetailedResponse, PublisherResponse } from "@/types/pb";

const index = ref(0);
const swiperEl = ref();

defineProps<{
  data: BookDetailedResponse<{
    publisher: PublisherResponse;
  }>[];
}>();
</script>

<template>
  <div class="flex flex-col-reverse gap-12 overflow-hidden sm:flex-row">
    <div class="relative z-10 -mt-28 flex-1 sm:mt-12">
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-x-3"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all absolute left-0 right-0"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-3"
      >
        <div :key="index" class="h-72 w-full">
          <div v-if="data[index].publishDate" class="mb-3">
            {{
              $t("general.dateRelease", {
                date: $d(new Date(data[index].publishDate)),
              })
            }}
          </div>
          <h2 class="mb-6 line-clamp-3 font-lexend text-3xl">
            {{ data[index].name }}
          </h2>
          <div>
            <p class="mb-6 text-gray-500 dark:text-gray-300">
              <span>
                <b>{{ $t("general.publishedBy") }}</b>
                {{ data[index].expand?.publisher.name }}
              </span>
              <br />
              <span v-if="data[index].price !== 0">
                <b>{{ $t("general.bookPrice") }}</b>
                {{ $n(data[index].price, "currency", "vi") }}
              </span>
            </p>
            <UButton
              :to="`/title/${data[index].title}`"
              icon="i-fluent-info-20-filled"
              color="gray"
            >
              {{ $t("general.viewTitleDetails") }}
            </UButton>
          </div>
        </div>
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
        v-for="book in data"
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
          :book="book"
          :src="book.cover[0] || book.baseCover[0]"
        />
      </SwiperSlide>
    </Swiper>
  </div>
</template>
