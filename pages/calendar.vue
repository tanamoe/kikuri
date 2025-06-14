<script setup lang="ts">
import dayjs from "dayjs";
import { joinURL } from "ufo";
import { Collections } from "@/types/pb";
import type { BooksCommon } from "@/types/common";

const { ogUrl } = useRuntimeConfig().public;
const nuxtApp = useNuxtApp();
const { $pb } = nuxtApp;
const { t } = useI18n({ useScope: "global" });
const store = useSettingsStore();
const route = useRoute();
const router = useRouter();

const month = computed({
  get: () =>
    route.query.month ? dayjs.tz(route.query.month as string) : dayjs.tz(),
  set: (v) => {
    router.push({
      query: {
        ...route.query,
        month: v.format("YYYY-MM"),
      },
    });
  },
});

const publishers = ref<string[]>([]);

const filter = computed(() =>
  parseCalendarFilter(
    month.value.startOf("month").format("YYYY-MM-DD"),
    month.value.startOf("month").add({ month: 1 }).format("YYYY-MM-DD"),
    {
      publishers: publishers.value,
      digital: store.display.digital,
      edition: store.display.editionedBook,
    },
  ),
);

const {
  data: releases,
  status,
  error,
  refresh,
} = await useLazyAsyncData(
  `calendar:${month.value.format("YYYY-MM")}`,
  () =>
    $pb.collection(Collections.Books).getFullList<BooksCommon>({
      filter: filter.value,
      sort: "+publishDate, +publication.release.title.name, +publication.volume, +edition",
      expand:
        "publication.release.title, assets_via_book, publication.defaultBook.assets_via_book",
    }),
  {
    transform: (releases) =>
      groupBy(releases, (release) => release.publishDate),
    watch: [filter],
    deep: false,
  },
);

const dates = computed(() => {
  if (releases.value) {
    return Object.keys(releases.value).map((date) =>
      dayjs(date).format("YYYY-MM-DD"),
    );
  } else return [];
});

definePageMeta({
  layout: "full",
  stickyNav: false,
});

useSeoMeta({
  title: t("general.releaseCalendar"),
  description: t("seo.calendarDescription"),
  ogTitle: t("general.releaseCalendar"),
  ogDescription: t("seo.calendarDescription"),
  ogImage: joinURL(ogUrl, "calendar"),
  ogImageAlt: t("general.releaseCalendar"),
});
</script>

<template>
  <div>
    <CalendarToolbar
      v-model:month="month"
      v-model:publishers="publishers"
      :pending="status === 'pending'"
    />

    <UContainer
      v-if="status === 'pending'"
      class="my-12 flex items-center justify-center"
    >
      <div class="text-center">
        <p>{{ "٩(>ᗜ<)و ♡" }}</p>
        <h1 class="font-lexend my-3 text-4xl font-bold">
          {{ $t("calendar.loading") }}
        </h1>
        <p>{{ $t("calendar.loadingDescription") }}</p>
      </div>
    </UContainer>

    <UContainer
      v-else-if="error || !releases || Object.keys(releases).length === 0"
      class="my-12 flex items-center justify-center"
    >
      <div class="text-center">
        <p>{{ "~(>_<~)" }}</p>
        <template v-if="error">
          <h1 class="font-lexend my-3 text-4xl font-bold">
            {{ error.name }}
          </h1>
          <p>{{ error.message }}</p>
        </template>
        <template v-else>
          <h1 class="font-lexend my-3 text-4xl font-bold">
            {{ $t("calendar.noReleases") }}
          </h1>
          <p>{{ $t("calendar.noReleasesDescription") }}</p>
        </template>
      </div>
    </UContainer>

    <UContainer v-else>
      <div
        v-for="(group, key) in releases"
        :id="dayjs(key).format('YYYY-MM-DD')"
        :key="key"
        class="release-day mb-24 flex scroll-mt-[calc(var(--toolbar-height)_+_1rem)] gap-6"
        :class="{
          'flex-col': store.display.datePosition === 'top',
        }"
      >
        <div
          class="sticky flex-shrink-0 self-start"
          :class="{
            'top-[calc(var(--toolbar-height)_+_1rem)] w-12 md:w-20':
              store.display.datePosition === 'left',
            'top-[calc(var(--toolbar-height)_+_0.5rem)] w-full bg-neutral-50 ring-8 ring-neutral-50 dark:bg-neutral-900 dark:ring-neutral-900':
              store.display.datePosition === 'top',
          }"
        >
          <CalendarDate :date="new Date(key)" />
        </div>
        <div
          class="grid w-full grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6"
        >
          <div v-for="book in group" :key="book.id">
            <AppBook
              v-if="book.expand?.publication.expand?.release.expand?.title"
              :book="book"
              :release="book.expand.publication.expand.release"
              :title="book.expand.publication.expand.release.expand.title"
              sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
              @add="refresh"
            />
          </div>
        </div>
      </div>

      <CalendarQuickNavigation :dates="dates" />
    </UContainer>

    <UContainer class="flex items-center justify-between">
      <UButton
        icon="i-fluent-arrow-left-20-filled"
        color="neutral"
        variant="subtle"
        @click="month = month.subtract(1, 'month')"
      >
        {{ $t("general.monthPrevious") }}
      </UButton>
      <UButton
        trailing-icon="i-fluent-arrow-right-20-filled"
        color="neutral"
        variant="subtle"
        @click="month = month.add(1, 'month')"
      >
        {{ $t("general.monthAfter") }}
      </UButton>
    </UContainer>
  </div>
</template>
