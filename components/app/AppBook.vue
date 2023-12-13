<script setup lang="ts">
import { joinURL } from "ufo";

import type { BookDetailsCommon } from "@/types/common";

const libraryPrompt = useLibraryPrompt();
const store = useSettingsStore();
const { showBookDetails, showBookPrice } = storeToRefs(store);

const ui = {
  base: "relative",
  shadow: "shadow",
  body: {
    padding: "p-0 sm:p-0",
  },
};

defineProps<{
  book: BookDetailsCommon;
}>();
</script>

<template>
  <NuxtLink
    v-if="book.expand && book.expand.publication && book.expand.release"
    :to="
      book.expand?.release.title
        ? joinURL('/title/' + book.expand.release.title)
        : ''
    "
    class="group"
  >
    <UCard :ui="ui">
      <UBadge
        v-if="book.expand.publication.digital == true"
        class="absolute right-2 top-2 z-10 text-gray-900"
        color="red"
      >
        Digital
      </UBadge>
      <UBadge
        v-else-if="book.edition !== ''"
        class="absolute right-2 top-2 z-10 text-gray-900"
        color="tanaamber"
      >
        {{ book.edition }}
      </UBadge>

      <UButton
        class="absolute bottom-2 right-2 z-10 shadow-lg"
        icon="i-fluent-add-20-filled"
        @click.prevent="
          libraryPrompt.add({
            id: book.id,
            name: book.expand.publication.name,
          })
        "
      />

      <AppCover
        class="transition-all group-hover:brightness-75"
        :name="book.expand.publication.name"
        :src="
          book.metadata?.images && Array.isArray(book.metadata.images)
            ? book.metadata.images[0]['1920w']
            : undefined
        "
        :srcset="
          book.metadata?.images && Array.isArray(book.metadata.images)
            ? book.metadata.images[0]
            : undefined
        "
        v-bind="$attrs"
      />
    </UCard>

    <div v-if="showBookDetails" class="mt-2">
      <div
        v-if="
          book.expand.publication.volume < 90000000 &&
          book.expand.publication.volume > 0
        "
        class="space-y-1"
      >
        <div
          v-if="book.expand?.release.expand?.title.name"
          class="decoration-primary-400 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
        >
          {{ book.expand.release.expand.title.name }}
        </div>
        <div class="text-gray-500 dark:text-gray-400">
          {{
            $t("general.volumeNumber", {
              volume: parseVolume(book.expand.publication.volume),
            })
          }}
        </div>
      </div>
      <div v-else>
        <span
          class="decoration-primary-400 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
        >
          {{ book.expand.publication.name }}
        </span>
      </div>
    </div>

    <div v-if="showBookPrice" :class="showBookDetails ? 'mt-1' : 'mt-2'">
      <span class="block text-gray-500 dark:text-gray-400">
        {{ $n(book.price, "currency", "vi") }}
      </span>
    </div>
  </NuxtLink>
</template>
