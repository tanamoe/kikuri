<script setup lang="ts">
import dayjs from "dayjs";
import {
  Collections,
  type FormatsResponse,
  type PublishersResponse,
  type ReleaseDetailsResponse,
  type TitlesResponse,
} from "@/types/pb";
import type { BooksCommon, MetadataCommon } from "@/types/common";

const {
  public: { ogUrl },
} = useRuntimeConfig();
const { t } = useI18n({ useScope: "global" });
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
  }),
);

const { data: updatedBooks } = await useAsyncData(() =>
  $pb.collection(Collections.Books).getList<BooksCommon>(1, 6, {
    sort: "-updated",
    expand:
      "publication.release.title, assets_via_book, publication.defaultBook.assets_via_book",
  }),
);

const { data: updatedReleases } = await useLazyAsyncData(() =>
  $pb.collection(Collections.ReleaseDetails).getList<
    ReleaseDetailsResponse<
      MetadataCommon,
      {
        title: TitlesResponse<
          MetadataCommon,
          {
            format: FormatsResponse;
          }
        >;
        publisher: PublishersResponse;
      }
    >
  >(1, 6, {
    expand: "title.format,publisher",
    sort: "-updated",
  }),
);

useSeoMeta({
  description: t("seo.description"),
  ogTitle: "Tana.moe",
  ogDescription: t("seo.description"),
  ogImage: ogUrl,
  ogImageAlt: "Tana.moe",
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

    <PageIndexRecentBooks v-if="updatedBooks" :books="updatedBooks.items" />

    <PageIndexRecentReleases
      v-if="updatedReleases"
      :releases="updatedReleases.items"
    />
  </div>
</template>
