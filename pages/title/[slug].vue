<script setup lang="ts">
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
  type AdditionalTitleNamesResponse,
} from "@/types/pb";
import type { MetadataCommon } from "@/types/common";

const route = useRoute();
const { ogUrl } = useRuntimeConfig().public;
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const { data: title } = await useAsyncData(() =>
  $pb.collection(Collections.Titles).getFirstListItem<
    TitlesResponse<
      MetadataCommon,
      {
        releases_via_title: ReleasesResponse<{
          publisher: PublishersResponse;
          partner?: PublishersResponse;
        }>[];
        links_via_title: LinksResponse<{
          source: LinkSourcesResponse;
        }>[];
        format: FormatsResponse;
        genres: GenresResponse[];
        demographic: DemographicsResponse;
        additionalTitleNames_via_title: AdditionalTitleNamesResponse[];
        works_via_title: WorksResponse<{
          staff: StaffsResponse;
        }>[];
      }
    >
  >($pb.filter("slug = {:slug}", { slug: route.params.slug }), {
    expand:
      "releases_via_title.publisher,releases_via_title.partner,links_via_title.source,format,genres,demographic,additionalTitleNames_via_title,works_via_title.staff",
    sort: "+works_via_title.priority,-additionalTitleNames_via_title.language,-additionalTitleNames_via_title.name",
  }),
);

if (!title.value) {
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });
}

const { data: reviews } = await useAsyncData(() =>
  $pb.collection(Collections.Reviews).getFullList<
    ReviewsResponse<{
      user: UsersResponse;
    }>
  >({
    filter: $pb.filter("release.title = {:title}", { title: title.value?.id }),
    fields: "*,content:excerpt(200,true)",
    expand: "user",
  }),
);

const ogImage = computed(() => {
  if (title.value) {
    const url = new URL("/title", ogUrl);
    url.searchParams.set("name", title.value.name);
    url.searchParams.set("format", title.value.expand!.format.name);
    if (title.value.expand?.demographic) {
      url.searchParams.set("demographic", title.value.expand.demographic.name);
    }
    if (title.value.expand?.genres) {
      title.value.expand.genres.forEach((genre) =>
        url.searchParams.append("genre", genre.name),
      );
    }
    if (title.value.cover)
      url.searchParams.set(
        "image",
        $pb.files.getUrl(title.value, title.value.cover),
      );

    return url;
  }

  return null;
});

const description = computed(() => {
  if (title.value?.description) {
    // replace formatting tags
    const desc = title.value.description.replace(/<[^>]*>/g, "");

    if (desc.length > 250) {
      return desc.slice(0, 250) + "…";
    }

    return desc;
  }

  return null;
});

useSeoMeta({
  title: title.value.name,
  description: description.value,
  ogTitle: title.value.name,
  ogDescription: description.value,
  ogImage: ogImage.value?.toString(),
  ogImageAlt: title.value.name,
});
</script>

<template>
  <div v-if="title">
    <PageTitleHeader :title />

    <div class="mt-6 flex flex-col-reverse gap-6 lg:flex-row">
      <div class="flex-1">
        <PageTitleSectionReleases
          v-if="
            title.expand?.releases_via_title &&
            title.expand?.releases_via_title.length > 0
          "
          :releases="title.expand.releases_via_title"
        />

        <PageTitleSectionCovers
          v-if="title.expand?.releases_via_title"
          :releases="title.expand.releases_via_title"
          :title-id="title.id"
        />

        <PageTitleSectionReviews
          v-if="reviews && reviews.length > 0"
          :reviews="reviews"
        />
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
          :works="title.expand?.works_via_title"
          :additional-names="title.expand?.additionalTitleNames_via_title"
        />

        <PageTitleSectionMangaUpdates :title />

        <PageTitleSectionLinks
          v-if="
            title.expand?.links_via_title &&
            title.expand?.links_via_title.length > 0
          "
          :links="title.expand?.links_via_title"
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
