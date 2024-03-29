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
  >($pb.filter("slug = {:slug}", { slug: route.params.slug }), {
    expand:
      "releases(title).publisher,links(title).source,format,genres,demographic",
  }),
);

if (!title.value) {
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });
}

const { data: works } = await useAsyncData(() =>
  $pb.collection(Collections.Works).getFullList<
    WorksResponse<{
      staff: StaffsResponse;
    }>
  >({
    filter: $pb.filter("title = {:title}", { title: title.value?.id }),
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
});

const description = computed(() => {
  if (title.value?.description) {
    // replace formatting tags
    const desc = title.value.description.replace(/<[^>]*>/g, "");
    if (desc.length > 250) {
      return desc.slice(0, 250) + "...";
    }
    return desc;
  }
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
    <PageTitleHeader :title="title" />

    <div class="mt-6 flex flex-col-reverse gap-6 lg:flex-row">
      <div class="flex-1">
        <PageTitleSectionReleases
          v-if="
            title.expand?.['releases(title)'] &&
            title.expand?.['releases(title)'].length > 0
          "
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
