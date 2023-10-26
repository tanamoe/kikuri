<script setup lang="ts">
/* eslint-disable vue/no-v-html */
import {
  Collections,
  type TitlesResponse,
  type FormatsResponse,
  type WorksResponse,
  type StaffsResponse,
  type ReleasesResponse,
  type PublishersResponse,
} from "@/types/pb";
import type { MetadataCommon } from "@/types/common";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const { data: title } = await useAsyncData(() =>
  $pb.collection(Collections.Titles).getOne<
    TitlesResponse<
      MetadataCommon,
      {
        "works(title)": WorksResponse<{
          staff: StaffsResponse;
        }>[];
        "releases(title)": ReleasesResponse<{
          publisher: PublishersResponse;
        }>[];
        format: FormatsResponse;
      }
    >
  >(route.params.id as string, {
    expand: "works(title).staff,releases(title).publisher,format",
  }),
);

const releases = computed(() => title.value?.expand?.["releases(title)"]);
const works = computed(() => title.value?.expand?.["works(title)"]);

if (!title.value)
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });

const ogImage = new URL("/title", runtimeConfig.public.ogUrl);
ogImage.searchParams.set("name", title.value.name);
ogImage.searchParams.set("format", title.value.expand!.format.name);
if (title.value.cover)
  ogImage.searchParams.set(
    "image",
    $pb.files.getUrl(title.value, title.value.cover),
  );

useSeoMeta({
  title: title.value.name,
  description: title.value.description.replace(/<[^>]*>/g, "").slice(0, 200),
  ogTitle: title.value.name,
  ogDescription: title.value.description.replace(/<[^>]*>/g, "").slice(0, 200),
  ogImage: ogImage.toString(),
  ogImageAlt: title.value.name,
});

definePageMeta({
  layout: "full",
});
</script>

<template>
  <UContainer v-if="title">
    <PageTitleHeader :title="title" />

    <div class="mt-6 flex flex-col-reverse gap-6 lg:flex-row">
      <div class="flex-1">
        <PageTitleSectionReleases v-if="releases" :releases="releases" />

        <PageTitleSectionReviews :title-id="title.id" />

        <PageTitleSectionCovers :title-id="title.id" />
      </div>

      <div class="w-full flex-shrink-0 space-y-6 lg:w-64">
        <div class="flex gap-3">
          <UButton class="flex-1" block disabled>
            {{ $t("general.follow") }}
          </UButton>
          <AppShareButton :title="title.name" />
        </div>

        <PageTitleSectionWorks
          v-if="works && works.length > 0"
          :works="works"
        />

        <UButton
          :to="`/review/create?title=${title.id}`"
          color="gray"
          icon="i-fluent-pen-20-filled"
          block
        >
          {{ $t("review.create") }}
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
