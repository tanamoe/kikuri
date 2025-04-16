<script setup lang="ts">
import { joinURL } from "ufo";
import type { MetadataImages, MetadataLibrary } from "@/types/common";
import type {
  AssetsResponse,
  BooksResponse,
  PublicationsResponse,
  ReleasesResponse,
  TitlesResponse,
} from "@/types/pb";

export interface AppBookProps {
  book: BooksResponse<
    MetadataLibrary,
    {
      assets_via_book?: AssetsResponse<MetadataImages>[];
      publication: PublicationsResponse<
        unknown,
        {
          defaultBook: BooksResponse<
            unknown,
            { assets_via_book?: AssetsResponse<MetadataImages>[] }
          >;
        }
      >;
    }
  >;
  release: ReleasesResponse;
  title: TitlesResponse;
  sizes?: string;
  wide?: boolean;
  draggable?: boolean;
  showButton?: boolean;
}

const store = useSettingsStore();

const props = withDefaults(defineProps<AppBookProps>(), {
  sizes: "(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw",
  wide: false,
  draggable: true,
  showButton: true,
});

defineEmits<{
  add: [];
}>();

const publication = computed(() => props.book.expand?.publication);

const image = computed(() => {
  const _asset = props.book.expand?.assets_via_book?.find(
    (asset) => asset.type === "0000000000cover",
  );
  const _default =
    props.book.expand?.publication.expand?.defaultBook?.expand?.assets_via_book?.find(
      (asset) => asset.type === "0000000000cover",
    );

  return _asset ?? _default;
});

const name = computed(
  () => publication.value?.name ?? props.release?.name ?? props.title?.name,
);

const ui = {
  root: "overflow-hidden relative",
  body: "p-0 sm:p-0",
};

const to = computed(() => {
  let path = "/title";

  if (props.title) {
    path = joinURL(path, props.title.slug);

    if (props.release) {
      path = joinURL(path, props.release.id, props.book.id);
    }
  }

  return path;
});
</script>

<template>
  <NuxtLink
    :to
    class="group h-auto w-full"
    :class="{
      'flex w-full gap-3': wide,
      'select-none': !draggable,
    }"
    :draggable
  >
    <UCard :ui :class="{ 'w-32 flex-shrink-0': wide }">
      <template v-if="!wide">
        <UBadge
          v-if="release && release.digital == true"
          class="absolute top-2 right-2 z-20 text-neutral-900"
          color="error"
        >
          Digital
        </UBadge>
        <UBadge
          v-else-if="book.edition"
          class="absolute top-2 right-2 z-20 text-neutral-900"
          color="primary"
        >
          {{ book.edition }}
        </UBadge>
      </template>

      <div
        v-if="$pb.authStore.record"
        class="absolute right-2 bottom-2 z-20 flex items-center gap-1"
      >
        <LibraryAddButton
          :id="book.id"
          :name="publication?.name ?? book.id"
          :in-collections="book.metadata?.inCollections"
          square
          color="neutral"
          class="gap-1"
          @add="() => $emit('add')"
        />
      </div>

      <AppImageCover
        class="relative transition-all group-hover:brightness-90 dark:group-hover:brightness-75"
        :name
        :src="image && $pb.files.getURL(image, image.image)"
        :srcset="image && image.resizedImage"
        :sizes
        :draggable
      />
    </UCard>

    <div>
      <template v-if="wide">
        <UBadge
          v-if="release && release.digital == true"
          class="text-neutral-900"
          color="error"
        >
          Digital
        </UBadge>
        <UBadge
          v-else-if="book.edition"
          class="text-neutral-900"
          color="primary"
        >
          {{ book.edition }}
        </UBadge>
      </template>

      <div v-if="store.display.bookDetails" class="mt-2">
        <div
          v-if="
            publication?.volume &&
            publication.volume < 90000000 &&
            publication.volume > 0
          "
          class="space-y-1"
        >
          <div
            v-if="release"
            class="decoration-primary-400 font-condensed line-clamp-4 text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
          >
            {{ release.name }}
            <span
              v-if="release.disambiguation"
              class="text-neutral-400 dark:text-neutral-500"
            >
              ({{ release.disambiguation }})
            </span>
          </div>
          <div class="text-neutral-500 dark:text-neutral-400">
            {{
              $t("general.volumeNumber", {
                volume: parseVolume(publication.volume),
              })
            }}
            <span v-if="publication.subtitle">
              ({{ publication.subtitle }})
            </span>
          </div>
        </div>
        <div v-else-if="publication">
          <span
            class="decoration-primary-400 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
          >
            {{ publication.name }}
          </span>
        </div>
      </div>

      <div v-if="store.display.bookPrice && book.price" class="mt-1">
        <span class="block text-neutral-500 dark:text-neutral-400">
          {{ $n(book.price, "currency", "vi") }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
