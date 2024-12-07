<script setup lang="ts">
import {
  Collections,
  type AssetsResponse,
  type TitlesResponse,
  type FormatsResponse,
  type ReleasesResponse,
  type PublishersResponse,
  type DemographicsResponse,
  type GenresResponse,
  type LinksResponse,
  type LinkSourcesResponse,
  type UsersResponse,
  type ReviewsResponse,
  type AdditionalTitleNamesResponse,
} from "@/types/pb";
import { joinURL, withQuery } from "ufo";
import type { BooksCommon, MetadataImages } from "~/types/common";

const route = useRoute();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const view = ref<"grid" | "list">("grid");

const { data: release, error } = await useAsyncData(() =>
  $pb.collection(Collections.Releases).getFirstListItem<
    ReleasesResponse<{
      publisher: PublishersResponse;
      partner: PublishersResponse;
      title: TitlesResponse<
        unknown,
        {
          format: FormatsResponse;
          demographic: DemographicsResponse;
          genres: GenresResponse[];
          links_via_title: LinksResponse<{
            source: LinkSourcesResponse;
          }>[];
          additionalTitleNames_via_title: AdditionalTitleNamesResponse[];
        }
      >;
      logo: AssetsResponse<MetadataImages>;
      banner: AssetsResponse<MetadataImages>;
      reviews_via_release: ReviewsResponse<{
        user: UsersResponse;
      }>[];
    }>
  >(
    $pb.filter("title.slug = {:slug} && id = {:release}", {
      slug: route.params.slug,
      release: route.params.release,
    }),
    {
      expand:
        "publisher, partner, title, title.format, title.demographic, title.genres, title.links_via_title.source, title.additionalTitleNames_via_title, reviews_via_release.user, logo, banner",
      fields:
        "*, expand.*, expand.reviews_via_release.*, expand.reviews_via_release.content:excerpt(200,true)",
    },
  ),
);

const title = computed(() => release.value?.expand?.title);
const reviews = computed(() => release.value?.expand?.reviews_via_release);

const { data: books, refresh } = await useAsyncData(() =>
  $pb.collection(Collections.Books).getFullList<BooksCommon>({
    filter: $pb.filter("publication.release = {:release}", {
      release: route.params.release,
    }),
    sort: "+publication.volume,+publishDate,+edition,+assets_via_book.priority",
    expand:
      "publication.release.title, assets_via_book, publication.defaultBook.assets_via_book",
  }),
);

const { data: cover } = await useAsyncData(() =>
  $pb
    .collection(Collections.Assets)
    .getFirstListItem<AssetsResponse<MetadataImages>>(
      $pb.filter(
        "type = '0000000000cover' && book.publication.release = {:release}",
        {
          release: route.params.release,
        },
      ),
      { sort: "+book.publication.volume,+book.edition,+priority" },
    ),
);

const assets = computed(() =>
  books.value?.flatMap(
    (book) =>
      book.expand?.assets_via_book?.filter(
        (asset) => asset.type === "0000000000cover",
      ) ?? [],
  ),
);

if (!release.value) {
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });
}

useSeoMeta({
  title: release.value.name,
  description: title.value && parseToText(title.value.description),
  ogTitle: release.value.name,
  ogDescription: title.value && parseToText(title.value.description),
  ogImage: cover.value && $pb.files.getUrl(cover.value, cover.value.image),
  // TODO: calculate ogImage alt text
  // ogImageAlt: release.value.name,
});
</script>

<template>
  <div v-if="release && title">
    <header class="flex flex-col-reverse gap-6 sm:flex-row sm:items-end">
      <div class="z-20 -mt-24 flex-1 sm:mt-0">
        <div class="space-y-3">
          <AppImage
            v-if="release.expand?.logo"
            :src="
              $pb.files.getUrl(release.expand.logo, release.expand.logo.image)
            "
            :srcset="release.expand.logo.resizedImage"
            class="max-h-72 max-w-64"
            sizes="16rem"
          />

          <div class="space-x-3">
            <UBadge v-if="title.expand?.format">
              {{ title.expand.format.name }}
            </UBadge>
            <UBadge v-if="release.digital" color="red">Digital</UBadge>
          </div>
          <AppH1>
            {{ release.name }}
            <span
              v-if="release.disambiguation"
              class="text-gray-400 dark:text-gray-500"
            >
              ({{ release.disambiguation }})
            </span>
          </AppH1>
        </div>
      </div>

      <div class="relative ml-auto w-64 flex-shrink-0 xl:w-80">
        <div
          class="absolute inset-0 z-10 bg-gradient-to-t from-gray-50 to-transparent to-50% sm:hidden dark:from-gray-900"
        />
        <AppImageCover
          aspect="full"
          class="rounded-lg"
          loading="eager"
          :src="cover && $pb.files.getUrl(cover, cover.image)"
          :srcset="cover && cover.resizedImage"
          :name="release.name"
          sizes="(max-width: 640px) 80vw, (max-width: 1280px) 30vw, 15vw"
        />
      </div>
    </header>

    <div class="mt-6 flex flex-col-reverse gap-6 lg:flex-row">
      <div class="flex-1 space-y-12">
        <div
          class="prose prose-sm max-w-none dark:prose-invert"
          v-html="title.description"
        />

        <AppDigitalBanner
          v-if="title.expand?.links_via_title && assets && assets.length > 0"
          :assets
          :links="title.expand?.links_via_title"
        />

        <div class="mt-6 space-y-12">
          <div v-if="reviews && reviews.length > 0" class="space-y-3">
            <div class="flex items-center justify-between">
              <AppH2>{{ $t("general.review") }}</AppH2>
              <UButton
                :to="`/review/create?title=${title.id}`"
                color="gray"
                icon="i-fluent-pen-20-filled"
                square
              />
            </div>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <AppReview
                v-for="review in reviews"
                :key="review.id"
                :review
                :user="review.expand?.user"
              />
            </div>
          </div>

          <div v-if="books && books.length > 0" class="space-y-3">
            <div class="flex items-center justify-between">
              <AppH2>{{ $t("general.volumes") }}</AppH2>
              <UButtonGroup size="sm" orientation="horizontal">
                <UButton
                  icon="i-fluent-grid-20-filled"
                  :color="view === 'grid' ? 'primary' : 'gray'"
                  @click="() => (view = 'grid')"
                />
                <UButton
                  icon="i-fluent-list-20-filled"
                  :color="view === 'list' ? 'primary' : 'gray'"
                  @click="() => (view = 'list')"
                />
              </UButtonGroup>
            </div>

            <AppBooks :books :title :release :view @add="refresh" />
          </div>
        </div>
      </div>

      <div class="w-full flex-shrink-0 space-y-6 lg:w-64 xl:w-80">
        <UCard
          class="hover:prose-a:text-primary-400 dark:hover:prose-a:text-primary-400 prose prose-sm max-w-none dark:prose-invert prose-h4:my-0 prose-a:text-gray-700 hover:prose-a:underline prose-img:my-0 prose-hr:my-3 dark:prose-a:text-gray-200"
          :ui="{
            body: {
              base: 'divide-y divide-gray-200 dark:divide-gray-800',
              padding: 'p-0 sm:p-0',
            },
            footer: {
              padding: 'px-4 py-2 sm:px-4',
            },
          }"
        >
          <div class="space-y-3 p-4">
            <div>
              <h4>{{ $t("general.status") }}</h4>
              <AppStatusBadge :status="release.status" />
            </div>
          </div>

          <div class="space-y-3 p-4">
            <div>
              <h4>{{ $t("general.title") }}</h4>
              <NuxtLink :to="joinURL('/title', title.slug)">
                {{ title.name }}
              </NuxtLink>
            </div>
            <div v-if="title.expand?.demographic">
              <h4>{{ $t("general.demographic") }}</h4>
              <ULink
                :to="
                  withQuery('/browse/titles', {
                    demographic: title.expand.demographic.id,
                  })
                "
              >
                <UBadge class="mr-1.5 mt-1.5" color="gray">
                  {{ title.expand.demographic.name }}
                </UBadge>
              </ULink>
            </div>
            <div v-if="title.expand?.genres && title.expand?.genres.length > 0">
              <h4>{{ $t("general.genres") }}</h4>
              <ULink
                v-for="genre in title.expand.genres"
                :key="genre.id"
                :to="withQuery('/browse/titles', { genre: genre.id })"
              >
                <UBadge class="mr-1.5 mt-1.5" color="gray">
                  {{ genre.name }}
                </UBadge>
              </ULink>
            </div>
          </div>
          <div class="space-y-3 p-4">
            <div>
              <h4>{{ $t("general.type") }}</h4>
              <div>{{ release.type }}</div>
            </div>

            <div v-if="release.expand?.publisher">
              <h4>
                {{ $t("general.publisher") }}
              </h4>
              <ULink :to="joinURL('/publisher', release.expand.publisher.slug)">
                <AppPublisher :publisher="release.expand.publisher" />
              </ULink>
            </div>
            <div v-if="release.expand?.partner">
              <h4 class="font-bold">
                {{ $t("general.partner") }}
              </h4>
              <ULink :to="joinURL('/publisher', release.expand.partner.slug)">
                <AppPublisher :publisher="release.expand.partner" />
              </ULink>
            </div>
          </div>
        </UCard>

        <AppMangaUpdates
          :name="
            title.expand?.additionalTitleNames_via_title?.at(0)?.name ??
            title.name
          "
        />
      </div>
    </div>
  </div>
  <div v-else-if="error">
    {{ error }}
  </div>
</template>
