<script setup lang="ts">
import dayjs from "dayjs";
import { joinURL } from "ufo";
import { Collections } from "@/types/pb";
import type { FilterPublishers } from "@/utils/releases";
import type { BookDetailsCommon } from "@/types/common";
import type { LibraryBookAdd } from "#build/components";

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

const publishers = ref<FilterPublishers[]>([]);
const addModal = ref<undefined | InstanceType<typeof LibraryBookAdd>>();

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
    <PageCalendarToolbar
      v-model:month="month"
      v-model:publishers="publishers"
    />

    <PageCalendarEmpty v-if="!releases || Object.keys(releases).length === 0" />

    <PageCalendarError v-else-if="error" :error="error" />

    <template v-else>
      <PageCalendarReleases :add-modal="addModal" :releases="releases" />

      <PageCalendarQuickNavigation :dates="dates" />
    </template>

    <PageCalendarNavigation v-model:month="month" />

    <LazyLibraryBookAdd ref="addModal" @update="() => refresh()" />
  </div>
</template>
