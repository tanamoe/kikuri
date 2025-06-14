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
      logo: AssetsResponse<MetadataImages>;
      banner: AssetsResponse<MetadataImages>;
    }>
  >(
    $pb.filter("title.slug = {:slug} && id = {:release}", {
      slug: route.params.slug,
      release: route.params.release,
    }),
    {
      expand:
        "publisher, partner, title.links_via_title.source, title.format, logo, banner",
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
  ogImage: cover.value && $pb.files.getURL(cover.value, cover.value.image),
  // TODO: calculate ogImage alt text
  // ogImageAlt: release.value.name,
});
</script>

<template>
  <div v-if="book && title && publication && release">
    <header class="flex flex-col-reverse gap-6 sm:flex-row sm:items-end">
      <div class="z-20 -mt-24 flex-1 sm:mt-0">
        <div class="space-y-3">
          <AppImage
            v-if="release.expand?.logo"
            :src="
              $pb.files.getURL(release.expand.logo, release.expand.logo.image)
            "
            :srcset="release.expand.logo.resizedImage"
            class="max-h-72 max-w-64"
            sizes="16rem"
          />

          <div class="space-x-3">
            <UBadge v-if="title.expand?.format">
              {{ title.expand.format.name }}
            </UBadge>
            <UBadge v-if="book.edition" color="secondary">
              {{ book.edition }}
            </UBadge>
            <UBadge v-if="release?.digital" color="error">Digital</UBadge>
          </div>

          <div>
            <AppH1 class="mt-3">
              {{ publication.name }}
              <span
                v-if="release.disambiguation"
                class="text-neutral-400 dark:text-neutral-500"
              >
                ({{ release.disambiguation }})
              </span>
            </AppH1>
            <legend
              v-if="publication.subtitle"
              class="font-lexend mt-1 lg:text-lg"
            >
              {{ publication.subtitle }}
            </legend>
          </div>
        </div>
      </div>

      <div class="relative ml-auto w-64 flex-shrink-0 xl:w-80">
        <div
          class="absolute inset-0 bg-gradient-to-t from-neutral-50 to-transparent to-50% sm:hidden dark:from-neutral-900"
        />
        <AppImageCover
          aspect="full"
          class="rounded-lg"
          loading="eager"
          :src="cover && $pb.files.getURL(cover, cover.image)"
          :srcset="cover && cover.resizedImage"
          :name="release.name"
          sizes="(max-width: 640px) 80vw, (max-width: 1280px) 30vw, 15vw"
        />

        <div
          v-if="publication.volume < 90000000"
          class="absolute top-0 right-[96%] -z-10 origin-bottom-right -rotate-90 transform text-7xl font-black text-neutral-300 dark:text-neutral-700"
        >
          {{ parseVolume(publication.volume) }}
        </div>
      </div>
    </header>

    <div class="mt-6 flex flex-col-reverse gap-6 lg:flex-row">
      <div class="flex-1 space-y-12">
        <div
          v-if="publication.description"
          class="prose prose-sm dark:prose-invert max-w-none"
          v-html="publication.description"
        />

        <AppDigitalBanner
          v-if="title.expand?.links_via_title && assets && assets.length > 0"
          :assets
          :links="title.expand?.links_via_title"
        />

        <div class="mt-6 space-y-12">
          <div v-if="book.note">
            <AppH2>{{ $t("general.bonus") }}</AppH2>
            <p
              v-for="(sentence, key) in book.note.split('\n')"
              :key
              class="prose prose-sm dark:prose-invert mt-3 max-w-none"
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
            <AppH2>{{ $t("general.assets") }}</AppH2>
            <div class="mt-3 grid grid-cols-2 gap-6 md:grid-cols-4">
              <UCard
                v-for="asset in book.expand.assets_via_book"
                :key="asset.id"
                :ui="{
                  root: 'aspect-[1/1]',
                  body: 'flex items-center justify-center h-full w-full sm:p-3 px-3 py-3',
                  footer: 'sm:p-3 px-3 py-3',
                }"
              >
                <AppImage
                  class="h-full w-full object-contain"
                  :src="$pb.files.getURL(asset, asset.image)"
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
            <AppH2>{{ $t("general.otherVersion") }}</AppH2>
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
          class="prose-a:hover:text-primary prose prose-sm dark:prose-invert prose-h4:my-0 prose-a:text-muted prose-img:my-0 prose-hr:my-3 max-w-none"
          :ui="{
            body: 'divide-y divide-default p-0 sm:p-0',
            footer: 'px-4 py-2 sm:px-4',
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
        >
          {{ $t("general.nextVolume") }}
        </UButton>
      </div>
    </div>
  </div>
</template>
