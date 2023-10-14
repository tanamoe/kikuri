<script setup lang="ts">
import { joinURL } from "ufo";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";
import type { BooksDetailsResponse, TitlesResponse } from "@/types/pb";

const store = useSettingsStore();

const { showBookDetails, showBookPrice } = storeToRefs(store);

defineProps<{
  book: BooksDetailsResponse<{
    title: TitlesResponse;
  }>;
  sizes?: string;
}>();
</script>

<template>
  <NuxtLink :to="joinURL('/title/' + book.title)" class="group">
    <AppCard>
      <UBadge
        v-if="book.digital == true"
        class="absolute right-2 top-2 backdrop-blur"
        color="red"
        variant="overlay"
      >
        Digital
      </UBadge>
      <UBadge
        v-else-if="book.edition !== ''"
        class="absolute right-2 top-2 backdrop-blur"
        color="tanaamber"
        variant="overlay"
      >
        {{ book.edition }}
      </UBadge>
      <AppCover
        :book="book"
        :file-name="book.cover[0] || book.baseCover[0]"
        :sizes="sizes"
      />
    </AppCard>
    <div v-if="showBookDetails" class="mt-2">
      <div v-if="book.volume < 9000 && book.volume > 0" class="space-y-1">
        <div
          v-if="book.expand"
          class="decoration-primary-400 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
        >
          {{ book.expand.title.name }}
        </div>
        <div class="text-gray-500 dark:text-gray-400">
          {{ $t("general.volumeNumber", { volume: book.volume }) }}
        </div>
      </div>
      <div v-else>
        <span
          class="decoration-primary-400 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
        >
          {{ book.name }}
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
