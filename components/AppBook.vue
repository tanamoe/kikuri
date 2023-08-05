<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";
import type { BookDetailedResponse, TitleResponse } from "@/types/pb";

const store = useSettingsStore();

const { settings } = storeToRefs(store);

defineProps<{
  book: BookDetailedResponse<{
    title: TitleResponse;
  }>;
}>();
</script>

<template>
  <AppCard>
    <UBadge
      v-if="book.digital == true"
      class="absolute right-2 top-2 backdrop-blur"
      :ui="{
        variant: {
          solid: 'bg-red-300 bg-opacity-50 text-gray-800',
        },
      }"
    >
      Digital
    </UBadge>
    <UBadge
      v-else-if="book.edition !== ''"
      class="absolute right-2 top-2 backdrop-blur"
      :ui="{
        variant: {
          solid: 'bg-amber-300 bg-opacity-50 text-gray-800',
        },
      }"
    >
      {{ book.edition }}
    </UBadge>
    <AppCover
      :book="book"
      :src="book.cover[0] || book.baseCover[0]"
      sizes="sm:40vw md:20vw lg:10vw"
    />
  </AppCard>
  <div v-if="settings.showBookDetails" class="mt-2">
    <div v-if="book.volume < 9000 && book.volume > 0" class="space-y-1">
      <div v-if="book.expand" class="font-condensed text-xl font-black">
        {{ book.expand.title.name }}
      </div>
      <div class="text-zinc-500 dark:text-zinc-400">
        {{ $t("general.volumeNumber", { volume: book.volume }) }}
      </div>
    </div>
    <div v-else>
      <span class="block font-condensed text-xl font-black">
        {{ book.name }}
      </span>
    </div>
  </div>
  <div
    v-if="settings.showBookPrice"
    :class="settings.showBookDetails ? 'mt-1' : 'mt-2'"
  >
    <span class="block text-zinc-500 dark:text-zinc-400">
      {{ $n(book.price, "currency", "vi") }}
    </span>
  </div>
</template>
