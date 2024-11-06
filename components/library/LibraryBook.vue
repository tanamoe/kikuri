<script setup lang="ts">
import { joinURL } from "ufo";
import { Collections } from "@/types/pb";
import type { BaseReleaseResponse } from "~/types/api/release";
import type { BaseTitleResponse } from "~/types/api/title";
import type { CollectionBookResponse } from "~/types/api/collections";

export interface AppBookProps {
  item: CollectionBookResponse;
  release: BaseReleaseResponse;
  title: BaseTitleResponse;
  editable?: boolean;
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
  change: [];
}>();

const book = computed(() => props.item.book);
const publication = computed(() => book.value?.publication);

const name = computed(
  () => publication.value?.name ?? props.release?.name ?? props.title?.name,
);

const ui = {
  base: "relative overflow-hidden",
  shadow: "shadow",
  body: {
    padding: "p-0 sm:p-0",
  },
};

const to = computed(() => {
  let path = "/title";

  if (props.title) {
    path = joinURL(path, props.title.slug);

    if (props.release) {
      path = joinURL(path, props.release.id);

      if (book.value) {
        path = joinURL(path, book.value.id);
      }
    }
  }

  return path;
});
</script>

<template>
  <NuxtLink
    v-if="book"
    :to
    class="group h-auto w-full"
    :class="{ 'flex w-full gap-3': wide, 'select-none': !draggable }"
    :draggable
  >
    <UCard :ui :class="{ 'w-32 flex-shrink-0': wide }">
      <template v-if="!wide">
        <UBadge
          v-if="release && release.digital == true"
          class="absolute right-2 top-2 z-20 text-gray-900"
          color="red"
        >
          Digital
        </UBadge>
        <UBadge
          v-else-if="book.edition"
          class="absolute right-2 top-2 z-20 text-gray-900"
          color="tanaamber"
        >
          {{ book.edition }}
        </UBadge>
      </template>

      <div
        v-if="editable"
        class="absolute bottom-2 right-2 z-20 flex items-center gap-1"
      >
        <LibraryEditButton
          :id="book.id"
          :name="book.publication?.name ?? $t('general.tba')"
          :collection="item.collectionId"
          :quantity="item.quantity"
          :status="item.status"
          color="gray"
          @change="$emit('change')"
        />
        <LibraryRemoveButton
          :id="book.id"
          :name="book.publication?.name ?? $t('general.tba')"
          :collection="item.collectionId"
          color="gray"
          square
          @change="$emit('change')"
        />
      </div>

      <AppImageCover
        class="relative z-10 transition-all group-hover:brightness-90 dark:group-hover:brightness-75"
        :name
        :src="
          book.defaultAsset &&
          $pb.files.getUrl(
            { ...book.defaultAsset, collectionId: Collections.Assets },
            book.defaultAsset.image,
          )
        "
        :srcset="book.defaultAsset && book.defaultAsset.resizedImage"
        :sizes
        :draggable
      />

      <USkeleton class="absolute inset-0" />
    </UCard>

    <div>
      <template v-if="wide">
        <UBadge
          v-if="release && release.digital == true"
          class="text-gray-900"
          color="red"
        >
          Digital
        </UBadge>
        <UBadge
          v-else-if="book.edition"
          class="text-gray-900"
          color="tanaamber"
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
            class="decoration-primary-400 line-clamp-4 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
          >
            {{ release.name }}
          </div>
          <div class="text-gray-500 dark:text-gray-400">
            {{
              $t("general.volumeNumber", {
                volume: parseVolume(publication.volume),
              })
            }}
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

      <div class="mt-1 text-gray-600 dark:text-gray-400">
        {{ $t(`status.${item.status.toLowerCase()}`) }}
      </div>

      <div class="mt-1 flex gap-2 text-gray-600 dark:text-gray-400">
        <div>
          <span v-if="book.price">
            {{ $n(book.price, "currency", "vi") }}
          </span>
          &times;
          {{ item.quantity }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
