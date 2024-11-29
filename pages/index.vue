<script setup lang="ts">
import dayjs from "dayjs";
import { Collections } from "@/types/pb";
import type { BooksCommon } from "@/types/common";

const { t } = useI18n();
const { $pb } = useNuxtApp();

const now = dayjs.tz();

const { data: upcoming } = await useAsyncData(() =>
  $pb.collection(Collections.Books).getFullList<BooksCommon>({
    filter: $pb.filter("publishDate >= {:start} && publishDate <= {:end}", {
      start: now.startOf("day").format("YYYY-MM-DD"),
      end: now.add(3, "days").endOf("day").format("YYYY-MM-DD"),
    }),
    sort: "+publishDate, +publication.release.title.name, +publication.volume, +edition, +publication.defaultBook.assets_via_book.priority, +assets_via_book.priority",
    expand:
      "publication.release.title, publication.release.publisher, assets_via_book, publication.defaultBook.assets_via_book",
    requestKey: "upcoming",
  }),
);

const { data: recent } = await useAsyncData(() =>
  $pb.collection(Collections.Books).getList<BooksCommon>(1, 12, {
    sort: "-updated",
    expand:
      "publication.release.title, assets_via_book, publication.defaultBook.assets_via_book",
    requestKey: "recent",
  }),
);

useSeoMeta({
  description: t("seo.description"),
  ogTitle: "Tana.moe",
  ogDescription: t("seo.description"),
});

definePageMeta({
  layout: "full",
});
</script>

<template>
  <div class="space-y-24">
    <PageIndexSwiper v-if="upcoming && upcoming.length > 0" :books="upcoming" />

    <UContainer>
      <AppRegisterBanner />
    </UContainer>

    <PageIndexRecentBooks v-if="recent" :books="recent.items" />
  </div>
</template>
