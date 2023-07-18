<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Record } from "pocketbase";
import { useSettingsStore } from "@/stores/settings";

const store = useSettingsStore();

const { settings } = storeToRefs(store);

defineProps<{
  book: Partial<Record>;
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
    <AppCover :book="book" sizes="sm:40vw md:20vw lg:10vw" />
  </AppCard>
  <div v-if="settings.showBookDetails" class="mt-2">
    <div v-if="book.volume < 9000 && book.volume > 0" class="space-y-1">
      <span class="block font-condensed text-xl font-black">
        {{ (book.expand!.title as Record).name }}
      </span>
      <span class="block text-zinc-500 dark:text-zinc-400">
        {{ $t("calendar.volume", { volume: book.volume }) }}
      </span>
    </div>
    <div v-else>
      <span class="block font-condensed text-xl font-black">
        {{ book.name }}
      </span>
    </div>
  </div>
</template>
