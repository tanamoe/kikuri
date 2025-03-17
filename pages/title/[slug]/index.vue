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
  type AssetsResponse,
  type BooksResponse,
  type PublicationsResponse,
} from "@/types/pb";
import type { MetadataCommon, MetadataImages } from "@/types/common";

const route = useRoute();
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

const { data: assets } = await useAsyncData(() =>
  $pb.collection(Collections.Assets).getList<
    AssetsResponse<
      MetadataImages,
      {
        book: BooksResponse<
          unknown,
          {
            publication: PublicationsResponse;
          }
        >;
      }
    >
  >(1, 16, {
    filter: $pb.filter(
      "type = {:type} && book.publication.release.title = {:title}",
      {
        type: "0000000000cover",
        title: title.value?.id,
      },
    ),
    sort: "+book.publication.volume,+book.publication.release,+priority",
    expand: "book.publication",
  }),
);

const cover = computed(() => assets.value?.items[0]);

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

useSeoMeta({
  title: title.value.name,
  description: title.value && parseToText(title.value.description),
  ogTitle: title.value.name,
  ogDescription: title.value && parseToText(title.value.description),
  ogImage: cover.value && $pb.files.getUrl(cover.value, cover.value.image),
  // TODO: calculate ogImage alt text
  // ogImageAlt: release.value.name,
});
</script>

<template>
  <div v-if="title">
    <header class="flex flex-col-reverse gap-6 sm:flex-row sm:items-end">
      <div class="z-20 -mt-24 flex-1 sm:mt-0">
        <UBadge v-if="title.expand?.format">
          {{ title.expand.format.name }}
        </UBadge>
        <AppH1 class="mt-3">{{ title.name }}</AppH1>
      </div>
      <div class="relative ml-auto w-64 flex-shrink-0 xl:w-80">
        <div
          class="absolute inset-0 z-10 bg-gradient-to-t from-neutral-50 to-transparent to-50% sm:hidden dark:from-neutral-900"
        />
        <AppImageCover
          aspect="full"
          class="rounded-lg"
          loading="eager"
          :src="cover && $pb.files.getUrl(cover, cover.image)"
          :srcset="cover && cover.resizedImage"
          :name="title.name"
          sizes="(max-width: 640px) 80vw, (max-width: 1280px) 30vw, 15vw"
        />
      </div>
    </header>

    <div class="mt-6 flex flex-col-reverse gap-6 lg:flex-row">
      <div class="flex-1 space-y-12">
        <div
          v-if="title.description"
          class="prose prose-sm dark:prose-invert max-w-none"
          v-html="title.description"
        />

        <AppDigitalBanner
          v-if="
            title.expand?.links_via_title &&
            assets?.items &&
            assets.items.length > 0
          "
          :assets="assets.items"
          :links="title.expand?.links_via_title"
        />

        <div class="mt-6">
          <PageTitleSectionReleases
            v-if="
              title.expand?.releases_via_title &&
              title.expand?.releases_via_title.length > 0
            "
            :title
            :releases="title.expand.releases_via_title"
          />

          <PageTitleSectionReviews
            v-if="reviews && reviews.length > 0"
            :reviews="reviews"
          />

          <PageTitleSectionCovers
            v-if="title.expand?.releases_via_title && assets?.items"
            :assets="assets.items"
            :releases="title.expand.releases_via_title"
            :title-id="title.id"
          />
        </div>
      </div>

      <div class="w-full flex-shrink-0 space-y-6 lg:w-64 xl:w-80">
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

        <AppMangaUpdates
          :name="
            title.expand?.additionalTitleNames_via_title?.at(0)?.name ??
            title.name
          "
        />
      </div>
    </div>
  </div>
</template>
