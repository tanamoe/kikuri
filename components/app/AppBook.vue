<script setup lang="ts">
import { joinURL } from "ufo";

import type { BookDetailsCommon } from "@/types/common";

const store = useSettingsStore();
const { showBookDetails, showBookPrice } = storeToRefs(store);

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
    <AppCard>
      <UBadge
        v-if="book.expand.publication.digital == true"
        class="absolute right-2 top-2 text-gray-900"
        color="red"
      >
        Digital
      </UBadge>
      <UBadge
        v-else-if="book.edition !== ''"
        class="absolute right-2 top-2 text-gray-900"
        color="tanaamber"
      >
        {{ book.edition }}
      </UBadge>
      <AppCover
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
    </AppCard>
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
