<script setup lang="ts">
import {
  Collections,
  type PublicationsResponse,
  type BooksResponse,
  type AssetsResponse,
  type TitlesResponse,
  type FormatsResponse,
  type AssetTypesResponse,
  type BookMetadataResponse,
  type ReleasesResponse,
  type PublishersResponse,
  type LinksResponse,
  type LinkSourcesResponse,
} from "@/types/pb";
import { joinURL } from "ufo";
import type { MetadataImages, MetadataLibrary } from "@/types/common";

const route = useRoute();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const { data: release } = await useAsyncData(() =>
  $pb.collection(Collections.Releases).getFirstListItem<
    ReleasesResponse<{
      publisher: PublishersResponse;
      partner: PublishersResponse;
      title: TitlesResponse<
        unknown,
        {
          format: FormatsResponse;
          links_via_title: LinksResponse<{
            source: LinkSourcesResponse;
          }>[];
        }
      >;
    }>
  >(
    $pb.filter("title.slug = {:slug} && id = {:release}", {
      slug: route.params.slug,
      release: route.params.release,
    }),
    {
      expand: "publisher, partner, title.links_via_title.source, title.format",
    },
  ),
);

const title = computed(() => release.value?.expand?.title);

const { data: book, refresh } = await useAsyncData(() =>
  $pb.collection(Collections.Books).getOne<
    BooksResponse<
      MetadataLibrary,
      {
        publication: PublicationsResponse<
          unknown,
          {
            defaultBook: BooksResponse<
              unknown,
              { assets_via_book: AssetsResponse<MetadataImages>[] }
            >;
          }
        >;
        assets_via_book: AssetsResponse<
          MetadataImages,
          { type: AssetTypesResponse }
        >[];
        bookMetadata_via_book: BookMetadataResponse;
      }
    >
  >(route.params.book as string, {
    expand:
      "publication.defaultBook.assets_via_book, assets_via_book.type, bookMetadata_via_book",
  }),
);

const publication = computed(() => book.value?.expand?.publication);

const { data: editions } = await useAsyncData(() =>
  $pb.collection(Collections.Books).getFullList<
    BooksResponse<
      MetadataLibrary,
      {
        assets_via_book: AssetsResponse<MetadataImages>[];
        publication: PublicationsResponse<
          unknown,
          {
            defaultBook: BooksResponse<
              unknown,
              { assets_via_book: AssetsResponse<MetadataImages>[] }
            >;
          }
        >;
      }
    >
  >({
    filter: $pb.filter(
      "publication.release = {:release} && publication.volume = {:volume} && id != {:id}",
      {
        release: route.params.release,
        volume: book.value?.expand?.publication.volume,
        id: book.value?.id,
      },
    ),
    sort: "+publication.volume,+publishDate,+edition,+assets_via_book.priority",
    expand: "assets_via_book, publication.defaultBook.assets_via_book",
  }),
);

const { data: books } = await useAsyncData(() =>
  $pb.collection(Collections.Books).getFullList<
    BooksResponse<
      MetadataLibrary,
      {
        assets_via_book: AssetsResponse<MetadataImages>[];
        publication: PublicationsResponse<
          unknown,
          {
            defaultBook: BooksResponse<
              unknown,
              { assets_via_book: AssetsResponse<MetadataImages>[] }
            >;
          }
        >;
      }
    >
  >({
    filter: $pb.filter(
      "publication.release = {:release} && publication.defaultBook = id",
      {
        release: route.params.release,
        volume: book.value?.expand?.publication.volume,
        id: book.value?.id,
      },
    ),
    sort: "+publication.volume,+publishDate,+edition,+assets_via_book.priority",
    expand: "assets_via_book, publication.defaultBook.assets_via_book",
  }),
);

const { data: previous } = await useAsyncData(() =>
  $pb.collection(Collections.Books).getFirstListItem(
    $pb.filter(
      "publication.release = {:release} && publication.volume < {:volume} && publication.defaultBook = id",
      {
        release: route.params.release,
        volume: book.value?.expand?.publication.volume,
      },
    ),
    {
      sort: "-publication.volume,+assets_via_book.priority",
      expand: "assets_via_book, publication.defaultBook.assets_via_book",
      fields: "id",
    },
  ),
);

const { data: next } = await useAsyncData(() =>
  $pb.collection(Collections.Books).getFirstListItem(
    $pb.filter(
      "publication.release = {:release} && publication.volume > {:volume} && publication.defaultBook = id",
      {
        release: route.params.release,
        volume: book.value?.expand?.publication.volume,
      },
    ),
    {
      sort: "+publication.volume,+assets_via_book.priority",
      fields: "id",
    },
  ),
);

const cover = computed(() => {
  if (book.value) {
    const _asset = book.value.expand?.assets_via_book?.find(
      (asset) => asset.type === "0000000000cover",
    );
    const _default =
      book.value.expand?.publication.expand?.defaultBook?.expand?.assets_via_book?.find(
        (asset) => asset.type === "0000000000cover",
      );
    return _asset ?? _default;
  }
  return undefined;
});

const metadata = computed(() => book.value?.expand?.bookMetadata_via_book);
const assets = computed(() =>
  books.value?.flatMap(
    (book) =>
      book.expand?.assets_via_book?.filter(
        (asset) => asset.type === "0000000000cover",
      ) ?? [],
  ),
);

if (!release.value || !book.value || !publication.value) {
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });
}

useSeoMeta({
  title: publication.value.name,
  description: publication.value && parseToText(publication.value.description),
  ogTitle: publication.value.name,
  ogDescription:
    publication.value && parseToText(publication.value.description),
  ogImage: cover.value && $pb.files.getUrl(cover.value, cover.value.image),
  // TODO: calculate ogImage alt text
  // ogImageAlt: release.value.name,
});
</script>

<template>
  <div v-if="book && title && publication && release">
    <header class="flex flex-col-reverse gap-6 sm:flex-row sm:items-end">
      <div class="z-20 -mt-24 flex-1 sm:mt-0">
        <div>
          <div class="space-x-3">
            <UBadge v-if="title.expand?.format">
              {{ title.expand.format.name }}
            </UBadge>
            <UBadge v-if="book.edition" color="amber">
              {{ book.edition }}
            </UBadge>
            <UBadge v-if="release?.digital" color="red">Digital</UBadge>
          </div>
          <AppH2 class="mt-3">
            <template
              v-if="publication.volume > 0 && publication.volume < 90000000"
            >
              {{ release.name }}
              -
              {{
                $t("general.volumeNumber", {
                  volume: parseVolume(publication.volume),
                })
              }}
            </template>
            <template v-else>{{ publication.name }}</template>
          </AppH2>
          <legend
            v-if="publication.subtitle"
            class="mt-1 font-lexend lg:text-lg"
          >
            {{ publication.subtitle }}
          </legend>
        </div>
      </div>

      <div class="relative ml-auto w-64 flex-shrink-0 xl:w-80">
        <div
          class="absolute inset-0 z-10 bg-gradient-to-t from-gray-50 to-transparent to-50% sm:hidden dark:from-gray-900"
        />
        <AppBookCover
          aspect="full"
          class="rounded-lg"
          loading="eager"
          :src="cover && $pb.files.getUrl(cover, cover.image)"
          :srcset="cover && cover.resizedImage"
          :name="release.name"
          sizes="(max-width: 640px) 80vw, 300px"
        />

        <div
          v-if="publication.volume < 90000000"
          class="absolute right-[96%] top-0 -z-10 origin-bottom-right -rotate-90 transform text-7xl font-black text-gray-300 dark:text-gray-700"
        >
          {{ parseVolume(publication.volume) }}
        </div>
      </div>
    </header>

    <div class="mt-6 flex flex-col-reverse gap-6 lg:flex-row">
      <div class="flex-1 space-y-12">
        <div
          v-if="publication.description"
          class="prose prose-sm max-w-none dark:prose-invert"
          v-html="publication.description"
        />

        <AppDigitalBanner
          v-if="title.expand?.links_via_title && assets"
          :assets
          :links="title.expand?.links_via_title"
        />

        <div class="mt-6 space-y-12">
          <div v-if="book.note">
            <AppH3>{{ $t("general.bonus") }}</AppH3>
            <p
              v-for="(sentence, key) in book.note.split('\n')"
              :key
              class="prose prose-sm mt-3 max-w-none dark:prose-invert"
            >
              {{ sentence }}
            </p>
          </div>

          <div
            v-if="
              book.expand?.assets_via_book &&
              book.expand?.assets_via_book.length > 0
            "
          >
            <AppH3>{{ $t("general.assets") }}</AppH3>
            <div class="mt-3 grid grid-cols-2 gap-6 md:grid-cols-4">
              <UCard
                v-for="asset in book.expand.assets_via_book"
                :key="asset.id"
                :ui="{
                  base: 'aspect-[1/1]',
                  body: {
                    base: 'flex items-center justify-center h-full w-full',
                    padding: 'sm:p-3 px-3 py-3',
                  },
                  footer: {
                    padding: 'sm:p-3 px-3 py-3',
                  },
                }"
              >
                <AppImage
                  class="h-full w-full object-contain"
                  :src="asset.image"
                  :srcset="asset.resizedImage"
                  :draggable="false"
                  sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
                />
                <template v-if="asset.expand?.type" #footer>
                  <p class="text-center text-sm">
                    {{ asset.expand.type.name }}
                  </p>
                </template>
              </UCard>
            </div>
          </div>

          <div v-if="editions && editions.length > 0">
            <AppH3>{{ $t("general.otherVersion") }}</AppH3>
            <div class="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2">
              <AppBook
                v-for="_book in editions"
                :key="_book.id"
                :book="_book"
                :publication="_book.expand?.publication"
                :release
                :title
                wide
                sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
                @add="refresh"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="w-full flex-shrink-0 space-y-6 lg:w-64 xl:w-80">
        <div class="flex gap-3">
          <LibraryAddButton
            :id="book.id"
            :name="publication.name"
            :in-collections="book.metadata?.inCollections"
            class="gap-3"
            @add="refresh"
          />
          <AppShareButton :title="title.name" />
        </div>

        <UCard
          class="hover:prose-a:text-primary-400 dark:hover:prose-a:text-primary-400 prose prose-sm max-w-none dark:prose-invert prose-h4:my-0 prose-a:text-gray-700 hover:prose-a:underline prose-hr:my-3 dark:prose-a:text-gray-200"
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
              <h4 class="font-bold">{{ $t("general.release") }}</h4>
              <NuxtLink :to="joinURL('/title', title.slug, release.id)">
                {{ release.name }}
                <template v-if="release.disambiguation">
                  ({{ release.disambiguation }})
                </template>
              </NuxtLink>
            </div>
            <div v-if="release.expand?.publisher">
              <h4 class="font-bold">
                {{ $t("general.publisher") }}
              </h4>
              <AppPublisher
                :publisher="release.expand.publisher"
                class="not-prose"
              />
            </div>
            <div v-if="release.expand?.partner">
              <h4 class="font-bold">
                {{ $t("general.partner") }}
              </h4>
              <AppPublisher
                :publisher="release.expand.partner"
                class="not-prose"
              />
            </div>
          </div>
          <div class="space-y-3 p-4">
            <div v-if="book.publishDate">
              <h4 class="font-bold">{{ $t("general.publishDate") }}</h4>
              <div>
                {{ $d(new Date(book.publishDate), "publishDate") }}
              </div>
            </div>
            <div>
              <h4 class="font-bold">{{ $t("general.price") }}</h4>
              <div>
                {{ $n(book.price, "currency", "vi") }}
              </div>
            </div>
          </div>
          <div v-if="metadata" class="space-y-3 p-4">
            <div v-if="metadata.fahasaSKU">
              <h4 class="font-bold">{{ $t("metadata.sku") }}</h4>
              <div class="slashed-zero tabular-nums">
                {{ metadata.fahasaSKU }}
              </div>
            </div>
            <div v-if="metadata.isbn">
              <h4 class="font-bold">{{ $t("metadata.isbn") }}</h4>
              <div class="slashed-zero tabular-nums">{{ metadata.isbn }}</div>
            </div>
            <div class="grid grid-cols-2">
              <div v-if="metadata.pageCount">
                <h4 class="font-bold">{{ $t("metadata.pageCount") }}</h4>
                <div>{{ metadata.pageCount }}</div>
              </div>
              <div v-if="metadata.weight">
                <h4 class="font-bold">{{ $t("metadata.weight") }}</h4>
                <div>{{ $n(metadata.weight, "gram") }}</div>
              </div>
            </div>
            <div v-if="metadata.sizeX && metadata.sizeY">
              <h4 class="font-bold">{{ $t("metadata.size") }}</h4>
              <div>
                {{
                  $t("metadata.dimension", {
                    x: $n(metadata.sizeX, "centimeter") || "?",
                    y: $n(metadata.sizeY, "centimeter") || "?",
                    z: $n(metadata.sizeZ, "centimeter") || "?",
                  })
                }}
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <AppBooksCarousel
      v-if="books"
      class="mt-12"
      :books
      :release
      :title
      :heading="$t('general.fullVolume')"
      :current="book.id"
    />

    <div class="mt-6 grid grid-cols-2 gap-6">
      <div class="text-left">
        <UButton
          v-if="previous"
          icon="i-fluent-arrow-left-20-filled"
          :to="joinURL('/title', title.slug, release.id, previous.id)"
          color="black"
        >
          {{ $t("general.previousVolume") }}
        </UButton>
      </div>
      <div class="text-right">
        <UButton
          v-if="next"
          icon="i-fluent-arrow-right-20-filled"
          :to="joinURL('/title', title.slug, release.id, next.id)"
          trailing
          color="black"
        >
          {{ $t("general.nextVolume") }}
        </UButton>
      </div>
    </div>
  </div>
</template>
