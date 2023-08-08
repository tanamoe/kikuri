<script setup lang="ts">
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";
import type { FilterPublishers } from "@/utils/releases";

const store = useSettingsStore();
const { settings } = storeToRefs(store);

const month = ref(dayjs.utc());
const publishers = ref<FilterPublishers[]>([]);
const monthRefs = ref<HTMLDivElement[]>([]);
const currentPosition = ref(0);

const {
  pending,
  data: releases,
  error,
} = await useAsyncData(
  () =>
    getCalendarReleases(
      month.value.startOf("month").format("YYYY-MM-DD"),
      month.value.endOf("month").format("YYYY-MM-DD"),
      publishers.value.map((publisher) => publisher.id),
      settings.value.showDigital
    ),
  {
    watch: [month, publishers, settings],
  }
);

const doScroll = () =>
  monthRefs.value[currentPosition.value].scrollIntoView({
    behavior: "smooth",
  });

const onScroll = () => {
  // for getting current position
  let min = window.innerHeight;
  monthRefs.value.forEach((div, i) => {
    if (
      div.getBoundingClientRect().top > 0 &&
      div.getBoundingClientRect().top < min
    ) {
      min = div.getBoundingClientRect().top;
      currentPosition.value = i;
    }
  });
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

definePageMeta({
  layout: "full",
  stickyNav: false,
});
</script>

<template>
  <div>
    <Head>
      <Title>{{ $t("general.releaseCalendar") }}</Title>
    </Head>

    <PageCalendarToolbar
      v-model:month="month"
      v-model:publishers="publishers"
    />

    <UContainer v-if="pending">
      <div
        v-for="(_, i) in [...Array(4)]"
        :key="i"
        ref="monthRefs"
        class="mb-24 flex scroll-mt-16 gap-6"
      >
        <div class="sticky top-16 self-start">
          <div class="space-y-3">
            <USkeleton class="h-4 w-12 rounded md:w-20" />
            <USkeleton class="h-12 w-12 rounded md:w-20" />
            <USkeleton class="h-12 w-12 rounded md:w-20" />
          </div>
        </div>
        <div
          class="grid w-full grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6"
        >
          <div v-for="(__, y) in [...Array(12)]" :key="y" class="space-y-3">
            <USkeleton class="aspect-[2/3] h-auto w-full rounded-md" />
            <USkeleton class="h-6 w-full rounded-md" />
            <USkeleton class="h-3 w-1/3 rounded-md" />
          </div>
        </div>
      </div>
    </UContainer>

    <UContainer
      v-if="releases === null"
      class="my-12 flex items-center justify-center"
    >
      <div class="text-center">
        <p>{{ "~(>_<~)" }}</p>
        <h1 class="my-3 font-lexend text-4xl font-black">
          {{ $t("calendar.noReleases") }}
        </h1>
        <p>{{ $t("calendar.noReleasesDescription") }}</p>
      </div>
    </UContainer>

    <UContainer v-if="error" class="my-12 flex items-center justify-center">
      <div class="text-center">
        <p>{{ "~(>_<~)" }}</p>
        <h1 class="my-3 font-lexend text-4xl font-black">
          {{ error.name }}
        </h1>
        <p>{{ error.message }}</p>
      </div>
    </UContainer>

    <UContainer>
      <div
        v-for="(group, key) in releases"
        :key="key"
        ref="monthRefs"
        class="mb-24 flex scroll-mt-28 gap-6 sm:scroll-mt-16"
      >
        <div
          class="sticky top-28 w-12 flex-shrink-0 self-start sm:top-16 md:w-20"
        >
          <PageCalendarDate :date="new Date(key)" />
        </div>
        <div
          class="grid w-full grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6"
        >
          <div v-for="book in group" :key="book.id">
            <AppBook :book="book" sizes="sm:30vw md:25vw lg:20vw xl:25vw" />
          </div>
        </div>
      </div>
    </UContainer>

    <PageCalendarQuickNavigation
      v-model="currentPosition"
      :length="monthRefs.length"
      @update:model-value="doScroll"
    />
  </div>
</template>
