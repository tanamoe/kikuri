<script setup lang="ts">
import dayjs from "dayjs";
import { storeToRefs } from "pinia";

import { useSettingsStore } from "@/stores/settings";
import type { FilterPublishers } from "@/types/calendarFilter";

const store = useSettingsStore();

const month = ref(dayjs());
const publishers = ref<FilterPublishers[]>([]);
const { settings } = storeToRefs(store);

const monthRefs = ref<HTMLDivElement[]>([]);
const currentPosition = ref(0);

const {
  pending,
  data: releases,
  error,
} = useCalendar(
  computed(() => month.value.startOf("month").toISOString()),
  computed(() => month.value.endOf("month").toISOString()),
  computed(() => publishers.value.map((publisher) => publisher.id)),
  computed(() => settings.value.showDigital)
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
            <USkeleton class="h-4 w-16 rounded" />
            <USkeleton class="h-12 w-16 rounded" />
            <USkeleton class="h-12 w-16 rounded" />
          </div>
        </div>
        <div
          class="grid w-full grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6"
        >
          <div v-for="(__, y) in [...Array(12)]" :key="y" class="space-y-3">
            <USkeleton class="aspect-[2/3] h-auto w-full rounded-2xl" />
            <USkeleton class="h-6 w-full rounded-2xl" />
            <USkeleton class="h-3 w-1/3 rounded-2xl" />
          </div>
        </div>
      </div>
    </UContainer>

    <UContainer v-else-if="releases && releases.length > 0">
      <div
        v-for="group in releases"
        :key="group.date.toDateString()"
        ref="monthRefs"
        class="mb-24 flex scroll-mt-28 gap-6 sm:scroll-mt-16"
      >
        <div
          class="sticky top-28 w-12 flex-shrink-0 self-start sm:top-16 md:w-20"
        >
          <PageCalendarDate :date="group.date" />
        </div>
        <div
          class="grid w-full grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6"
        >
          <div v-for="book in group.publications" :key="book.id">
            <AppBook :book="book" />
          </div>
        </div>
      </div>
    </UContainer>

    <UContainer
      v-else-if="releases && releases.length === 0"
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

    <UContainer
      v-else-if="error"
      class="my-12 flex items-center justify-center"
    >
      <div class="text-center">
        <p>{{ "~(>_<~)" }}</p>
        <h1 class="my-3 font-lexend text-4xl font-black">
          {{ error.name }}
        </h1>
        <p>{{ error.message }}</p>
      </div>
    </UContainer>

    <UContainer v-else class="my-12 flex items-center justify-center">
      <div class="text-center">
        <p>{{ "~(>_<~)" }}</p>
        <h1 class="my-3 font-lexend text-4xl font-black">
          {{ $t("calendar.unknownError") }}
        </h1>
        <p>{{ $t("calendar.unknownErrorDescription") }}</p>
      </div>
    </UContainer>

    <PageCalendarQuickNavigation
      v-model="currentPosition"
      :length="monthRefs.length"
      @update:model-value="doScroll"
    />
  </div>
</template>
