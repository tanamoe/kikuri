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

onMounted(() => {
  window.addEventListener("wheel", () => {
    // for getting current position
    let min = window.innerHeight;
    monthRefs.value.forEach((div, i) => {
      if (
        div.getBoundingClientRect().bottom > 0 &&
        div.getBoundingClientRect().bottom < min
      ) {
        min = div.getBoundingClientRect().bottom;
        currentPosition.value = i;
      }
    });
  });
});

definePageMeta({
  layout: "calendar",
});
</script>

<template>
  <div>
    <PageCalendarToolbar
      :month="month"
      :publishers="publishers"
      @update-month="(m) => (month = m)"
      @update-publishers="(p) => (publishers = p)"
    />

    <div v-if="pending" class="container mx-auto px-6">
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
    </div>

    <div
      v-else-if="releases && releases.length > 0"
      class="container mx-auto px-6"
    >
      <div
        v-for="group in releases"
        :key="group.date!.toDateString()"
        ref="monthRefs"
        class="mb-24 flex scroll-mt-16 gap-6"
      >
        <div
          class="sticky top-28 w-12 flex-shrink-0 self-start sm:top-16 md:w-20"
        >
          <PageCalendarDate :date="group.date!" />
        </div>
        <div
          class="grid w-full grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6"
        >
          <div v-for="book in group.publications" :key="book.id">
            <AppBook :book="book" />
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="releases && releases.length === 0"
      class="container mx-auto my-12 flex items-center justify-center px-6"
    >
      <div class="text-center">
        <p>{{ "~(>_<~)" }}</p>
        <h1 class="my-3 font-lexend text-4xl font-black">
          {{ $t("calendar.noReleases") }}
        </h1>
        <p>{{ $t("calendar.noReleasesDescription") }}</p>
      </div>
    </div>

    <div
      v-else-if="error"
      class="container mx-auto my-12 flex items-center justify-center px-6"
    >
      <div class="text-center">
        <p>{{ "~(>_<~)" }}</p>
        <h1 class="my-3 font-lexend text-4xl font-black">
          {{ error.name }}
        </h1>
        <p>{{ error.message }}</p>
      </div>
    </div>

    <div
      v-else
      class="container mx-auto my-12 flex items-center justify-center px-6"
    >
      <div class="text-center">
        <p>{{ "~(>_<~)" }}</p>
        <h1 class="my-3 font-lexend text-4xl font-black">
          {{ $t("calendar.unknownError") }}
        </h1>
        <p>{{ $t("calendar.unknownErrorDescription") }}</p>
      </div>
    </div>

    <PageCalendarQuickNavigation
      v-model="currentPosition"
      :length="monthRefs.length"
      @update:model-value="doScroll"
    />
  </div>
</template>
