<script setup lang="ts">
import dayjs from "dayjs";
import {
  Collections,
  type BookDetailsResponse,
  type PublicationsResponse,
  type ReleasesResponse,
  type PublishersResponse,
  type TitlesResponse,
} from "@/types/pb";
import type { MetadataCommon } from "@/types/common";

const {
  public: { ogUrl },
} = useRuntimeConfig();
const { t } = useI18n({ useScope: "global" });
const { $pb } = useNuxtApp();

const now = dayjs.tz();

type Texpand = {
  publication: Pick<PublicationsResponse, "name">;
  release: Pick<
    ReleasesResponse<{
      publisher: PublishersResponse;
      title: Pick<TitlesResponse, "slug">;
    }>,
    "expand" | "title"
  >;
};

const { data: releases } = await useAsyncData(() =>
  $pb
    .collection(Collections.BookDetails)
    .getFullList<BookDetailsResponse<MetadataCommon, string, Texpand>>({
      filter: `publishDate >= '${now.startOf("day").format("YYYY-MM-DD")}'
         && publishDate <= '${now
           .add(3, "days")
           .endOf("day")
           .format("YYYY-MM-DD")}'`,
      sort: "+publishDate",
      expand: "publication,release.publisher,release.title",
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
    <PageIndexSwiper
      v-if="releases && releases.length > 0"
      :releases="releases"
    />

    <UContainer>
      <AppRegisterBanner />
    </UContainer>

    <PageIndexRecentBooks />

    <PageIndexRecentReleases />
  </div>
</template>
