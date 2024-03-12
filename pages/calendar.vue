<script setup lang="ts">
import dayjs from "dayjs";
import { joinURL } from "ufo";
import { Collections } from "@/types/pb";
import type { FilterPublishers } from "@/utils/releases";
import type { BookDetailsCommon } from "@/types/common";
import { LibraryModalBookAdd } from "#components";

const { ogUrl } = useRuntimeConfig().public;
const nuxtApp = useNuxtApp();
const { $pb } = nuxtApp;
const { t } = useI18n({ useScope: "global" });
const store = useSettingsStore();
const route = useRoute();
const router = useRouter();
const modal = useModal();

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

const publishers = ref<FilterPublishers[]>([]);

const filter = computed(() =>
  parseCalendarFilter(
    month.value.startOf("month").format("YYYY-MM-DD"),
    month.value.startOf("month").add({ month: 1 }).format("YYYY-MM-DD"),
    {
      publishers: publishers.value.map((publisher) => publisher.id),
      digital: store.display.digital,
      edition: store.display.editionedBook,
    },
  ),
);

const {
  data: releases,
  error,
  pending,
  refresh,
} = await useAsyncData(
  () =>
    $pb.collection(Collections.BookDetails).getFullList<BookDetailsCommon>({
      filter: filter.value,
      sort: "+publishDate, -edition",
      expand: "publication, release, release.title",
      fields:
        "*, expand.publication.volume, expand.publication.name, expand.publication.digital, expand.release.title, expand.release.expand.title.name, expand.release.expand.title.slug",
    }),
  {
    transform: (releases) =>
      groupBy<BookDetailsCommon>(releases, (p) => p.publishDate),
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

function handleAdd(book: BookDetailsCommon) {
  modal.open(LibraryModalBookAdd, {
    book: {
      id: book.id,
      name: book.expand?.publication?.name ?? book.id,
    },
    inCollections: book.metadata?.inCollections?.map((c) => c.id),
    callback: refresh,
  });
}

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
      :pending
    />

    <UContainer
      v-if="error || !releases || Object.keys(releases).length === 0"
      class="my-12 flex items-center justify-center"
    >
      <div class="text-center">
        <p>{{ "~(>_<~)" }}</p>
        <template v-if="error">
          <h1 class="my-3 font-lexend text-4xl font-bold">
            {{ error.name }}
          </h1>
          <p>{{ error.message }}</p>
        </template>
        <template v-else>
          <h1 class="my-3 font-lexend text-4xl font-bold">
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
        class="release-day mb-24 flex scroll-mt-28 gap-6 sm:scroll-mt-16"
        :class="{
          'flex-col': store.display.datePosition === 'top',
        }"
        style="scroll-margin-top: calc(var(--toolbar-height) + 1rem)"
      >
        <div
          class="sticky top-28 flex-shrink-0 self-start sm:top-16"
          :class="{
            'w-12 md:w-20': store.display.datePosition === 'left',
            'z-30 w-full bg-gray-50 ring-8 ring-gray-50 dark:bg-gray-900 dark:ring-gray-900':
              store.display.datePosition === 'top',
          }"
          style="top: var(--toolbar-height)"
        >
          <CalendarDate :date="new Date(key)" />
        </div>
        <div
          class="grid w-full grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6"
        >
          <div v-for="book in group" :key="book.id">
            <AppBook
              :book="book"
              sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
              @add="handleAdd"
            />
          </div>
        </div>
      </div>

      <CalendarQuickNavigation :dates="dates" />
    </UContainer>

    <UContainer class="flex items-center justify-between">
      <UButton
        icon="i-fluent-arrow-left-20-filled"
        color="gray"
        @click="month = month.subtract(1, 'month')"
      >
        {{ $t("general.monthPrevious") }}
      </UButton>
      <UButton
        trailing-icon="i-fluent-arrow-right-20-filled"
        color="gray"
        @click="month = month.add(1, 'month')"
      >
        {{ $t("general.monthAfter") }}
      </UButton>
    </UContainer>
  </div>
</template>
