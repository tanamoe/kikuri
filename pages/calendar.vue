<script setup lang="ts">
import dayjs from "dayjs";
import { joinURL } from "ufo";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";
import type { FilterPublishers } from "@/utils/releases";
import {
  type BooksDetailsResponse,
  Collections,
  type PublishersResponse,
  type TitlesResponse,
} from "@/types/pb";

const runtimeConfig = useRuntimeConfig();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const store = useSettingsStore();
const { showDigital, showEditionedBook } = storeToRefs(store);

const month = ref(dayjs.tz());
const publishers = ref<FilterPublishers[]>([]);

const filter = computed(() =>
  parseCalendarFilter(
    month.value.startOf("month").format("YYYY-MM-DD"),
    month.value.endOf("month").format("YYYY-MM-DD"),
    {
      publishers: publishers.value.map((publisher) => publisher.id),
      digital: showDigital.value,
      edition: showEditionedBook.value,
    },
  ),
);

const { pending, data, error } = await useAsyncData(
  () =>
    $pb.collection(Collections.BooksDetails).getFullList<
      BooksDetailsResponse<{
        title: TitlesResponse;
        publisher: PublishersResponse;
      }>
    >({
      filter: filter.value,
      sort: "+publishDate,+name,-edition",
      expand: "title, publisher",
    }),
  {
    watch: [filter],
  },
);

const releases = computed(() => {
  if (data.value) {
    return groupBy<
      BooksDetailsResponse<{
        title: TitlesResponse;
        publisher: PublishersResponse;
      }>
    >(
      data.value.map((release) => ({
        ...release,
        volume: parseVolume(release.volume),
      })),
      (p) => p.publishDate,
    );
  }

  return null;
});

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
  ogImage: joinURL(runtimeConfig.public.ogUrl, "calendar"),
  ogImageAlt: t("general.releaseCalendar"),
});
</script>

<template>
  <div>
    <PageCalendarToolbar
      v-model:month="month"
      v-model:publishers="publishers"
      :releases="data || []"
    />

    <PageCalendarPending v-if="pending" />

    <PageCalendarEmpty
      v-else-if="!releases || Object.keys(releases).length === 0"
    />

    <PageCalendarError v-else-if="error" :error="error" />

    <PageCalendarReleases v-else :releases="releases" />

    <PageCalendarQuickNavigation :dates="dates" />
  </div>
</template>
