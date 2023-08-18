<script setup lang="ts">
import dayjs from "dayjs";
import { joinURL } from "ufo";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";
import type { FilterPublishers } from "@/utils/releases";

const runtimeConfig = useRuntimeConfig();
const store = useSettingsStore();
const { showDigital, showEditionedBook, datePosition } = storeToRefs(store);

const month = ref(dayjs.tz());
const publishers = ref<FilterPublishers[]>([]);
const currentPosition = ref<HTMLDivElement>();

const {
  pending,
  data: releases,
  error,
} = await useAsyncData(
  () =>
    getCalendarReleases(
      month.value.startOf("month").format("YYYY-MM-DD"),
      month.value.endOf("month").format("YYYY-MM-DD"),
      {
        publishers: publishers.value.map((publisher) => publisher.id),
        digital: showDigital.value,
        edition: showEditionedBook.value,
      },
    ),
  {
    watch: [month, publishers, showDigital, showEditionedBook],
  },
);

const dates = computed(() => {
  if (releases.value) {
    return Object.keys(releases.value).map((date) =>
      dayjs(date).format("YYYY-MM-DD"),
    );
  } else return [];
});

const doScroll = (position: string) => {
  const el = document.getElementById(position) as HTMLDivElement;

  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
    });
  }
};

const onScroll = () => {
  const els = document.getElementsByClassName("release-day");
  currentPosition.value = Array.from(els as HTMLCollectionOf<HTMLDivElement>)
    .filter((el) => el.getBoundingClientRect().bottom > 100)
    .sort(
      (el1, el2) =>
        el1.getBoundingClientRect().bottom - el2.getBoundingClientRect().bottom,
    )[0];
};

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

definePageMeta({
  layout: "full",
  stickyNav: false,
});

useSeoMeta({
  ogImage: joinURL(runtimeConfig.public.ogUrl, "calendar"),
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
        :id="dayjs(key).format('YYYY-MM-DD')"
        :key="key"
        class="release-day mb-24 flex scroll-mt-28 gap-6 sm:scroll-mt-16"
        :class="{
          'flex-col': datePosition === 'top',
        }"
        style="scroll-margin-top: calc(var(--toolbar-height) - 1px)"
      >
        <div
          class="sticky top-28 flex-shrink-0 self-start sm:top-16"
          :class="{
            'w-12 md:w-20': datePosition === 'left',
            'z-10 w-full bg-gray-50 dark:bg-gray-900': datePosition === 'top',
          }"
          style="top: calc(var(--toolbar-height) - 1px)"
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
      :current-day="currentPosition?.id || ''"
      :dates="dates"
      :scroll="doScroll"
    />
  </div>
</template>
