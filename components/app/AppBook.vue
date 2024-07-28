<script setup lang="ts">
import { joinURL } from "ufo";
import type { BooksCommon, MetadataImages } from "@/types/common";

const store = useSettingsStore();

export interface Props {
  book: BooksCommon;
  showButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showButton: true,
});

defineEmits<{
  add: [BooksCommon];
}>();

const publication = props.book.expand?.publication;
const release = publication?.expand?.release;
const title = release?.expand?.title;

const _asset = props.book.expand?.assets_via_book?.find(
  (asset) => asset.type === "0000000000cover",
);
const _default =
  props.book.expand?.publication.expand?.defaultBook?.expand?.assets_via_book?.find(
    (asset) => asset.type === "0000000000cover",
  );
const image = (_asset ? _asset.resizedImage : _default?.resizedImage) as
  | MetadataImages
  | undefined;

const ui = {
  base: "relative overflow-hidden",
  shadow: "shadow",
  body: {
    padding: "p-0 sm:p-0",
  },
};
</script>

<template>
  <NuxtLink :to="title && joinURL('/title/' + title.slug)" class="group">
    <UCard :ui="ui">
      <UBadge
        v-if="release && release.digital == true"
        class="absolute right-2 top-2 z-20 text-gray-900"
        color="red"
      >
        Digital
      </UBadge>
      <UBadge
        v-else-if="book.edition !== ''"
        class="absolute right-2 top-2 z-20 text-gray-900"
        color="tanaamber"
      >
        {{ book.edition }}
      </UBadge>

      <ClientOnly>
        <div
          v-if="$pb.authStore.isAuthRecord && showButton"
          class="absolute bottom-2 right-2 z-20 flex items-center gap-1"
        >
          <UPopover v-if="book.metadata?.inCollections">
            <UTooltip :text="$t('library.view')" :popper="{ placement: 'top' }">
              <UButton
                icon="i-fluent-library-20-filled"
                class="shadow-lg"
                color="white"
                square
              />
            </UTooltip>

            <template v-if="book.metadata?.inCollections" #panel>
              <UCard
                :ui="{
                  body: {
                    padding: 'p-0 sm:p-0',
                  },
                  header: {
                    padding: 'px-3 py-2 sm:px-3 sm:py-2',
                  },
                }"
              >
                <UButton
                  v-for="collection in book.metadata.inCollections"
                  :key="collection.id"
                  :to="`/library/${collection.id}`"
                  color="gray"
                  variant="ghost"
                  block
                >
                  {{ collection.name }}
                </UButton>
              </UCard>
            </template>
          </UPopover>

          <UTooltip
            :text="$t('library.addToLibrary')"
            :popper="{ placement: 'top' }"
          >
            <UButton
              class="shadow-lg"
              icon="i-fluent-add-20-filled"
              color="white"
              @click.prevent="$emit('add', book)"
            />
          </UTooltip>
        </div>
      </ClientOnly>

      <AppCover
        class="relative z-10 transition-all group-hover:brightness-90 dark:group-hover:brightness-75"
        :name="publication?.name"
        :src="image && image['1920w']"
        :srcset="image"
        v-bind="$attrs"
      />

      <USkeleton class="absolute inset-0" />
    </UCard>

    <div v-if="store.display.bookDetails" class="mt-2">
      <div
        v-if="
          publication &&
          publication?.volume < 90000000 &&
          publication.volume > 0
        "
        class="space-y-1"
      >
        <div
          v-if="title?.name"
          class="decoration-primary-400 line-clamp-4 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
        >
          {{ title.name }}
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

    <div v-if="store.display.bookPrice" class="mt-1">
      <span class="block text-gray-500 dark:text-gray-400">
        {{ $n(book.price, "currency", "vi") }}
      </span>
    </div>
  </NuxtLink>
</template>
