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
  type LinksResponse,
  type LinkSourcesResponse,
  type GenresResponse,
  type DemographicsResponse,
  type ReviewsResponse,
  type UsersResponse,
} from "@/types/pb";
import type { MetadataCommon } from "@/types/common";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const { data: title } = await useAsyncData(() =>
  $pb.collection(Collections.Titles).getFirstListItem<
    TitlesResponse<
      MetadataCommon,
      {
        "releases(title)": ReleasesResponse<{
          publisher: PublishersResponse;
        }>[];
        "links(title)": LinksResponse<{
          source: LinkSourcesResponse;
        }>[];
        format: FormatsResponse;
        genres: GenresResponse[];
        demographic: DemographicsResponse;
      }
    >
  >(`slug='${route.params.slug}'`, {
    expand:
      "works(title),works(title).staff,releases(title).publisher,links(title).source,format,genres,demographic",
  }),
);

const { data: works } = await useAsyncData(() =>
  $pb.collection(Collections.Works).getFullList<
    WorksResponse<{
      staff: StaffsResponse;
    }>
  >({
    filter: `title = '${title.value?.id}'`,
    expand: "staff",
    sort: "+priority",
  }),
);

const { data: reviews } = await useAsyncData(() =>
  $pb.collection(Collections.Reviews).getFullList<
    ReviewsResponse<{
      user: UsersResponse;
    }>
  >({
    filter: `release.title='${title.value?.id}'`,
    fields: "*,content:excerpt(200,true)",
    expand: "user",
  }),
);

if (!title.value)
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });

const ogImage = new URL("/title", runtimeConfig.public.ogUrl);
ogImage.searchParams.set("name", title.value.name);
ogImage.searchParams.set("format", title.value.expand!.format.name);
if (title.value.expand?.demographic) {
  ogImage.searchParams.set("demographic", title.value.expand.demographic.name);
}
if (title.value.expand?.genres) {
  title.value.expand.genres.forEach((genre) =>
    ogImage.searchParams.append("genre", genre.name),
  );
}
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
</script>

<template>
  <div v-if="title">
    <PageTitleHeader :title="title" />

    <div class="mt-6 flex flex-col-reverse gap-6 lg:flex-row">
      <div class="flex-1">
        <PageTitleSectionReleases
          v-if="title.expand?.['releases(title)']"
          :releases="title.expand?.['releases(title)']"
        />

        <PageTitleSectionReviews
          v-if="reviews && reviews.length > 0"
          :reviews="reviews"
        />

        <PageTitleSectionCovers :title-id="title.id" />
      </div>

      <div class="w-full flex-shrink-0 space-y-6 lg:w-64">
        <div class="flex gap-3">
          <UButton class="flex-1" block disabled>
            {{ $t("general.follow") }}
          </UButton>
          <AppShareButton :title="title.name" />
        </div>

        <PageTitleSectionDetails
          :genres="title.expand?.genres"
          :demographic="title.expand?.demographic"
          :works="works"
        />

        <PageTitleSectionLinks
          v-if="
            title.expand?.['links(title)'] &&
            title.expand?.['links(title)'].length > 0
          "
          :links="title.expand?.['links(title)']"
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
  </div>
</template>