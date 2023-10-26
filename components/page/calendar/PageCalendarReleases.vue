<script setup lang="ts">
import dayjs from "dayjs";

import type { BookDetailsCommon } from "@/types/common";

const store = useSettingsStore();
const { datePosition } = storeToRefs(store);

defineProps<{
  releases: Record<string, BookDetailsCommon[]>;
}>();
</script>

<template>
  <UContainer>
    <div
      v-for="(group, key) in releases"
      :id="dayjs(key).format('YYYY-MM-DD')"
      :key="key"
      class="release-day mb-24 flex scroll-mt-28 gap-6 sm:scroll-mt-16"
      :class="{
        'flex-col': datePosition === 'top',
      }"
      style="scroll-margin-top: calc(var(--toolbar-height) + 1rem)"
    >
      <div
        class="sticky top-28 flex-shrink-0 self-start sm:top-16"
        :class="{
          'w-12 md:w-20': datePosition === 'left',
          'z-10 w-full bg-gray-50 ring-8 ring-gray-50 dark:bg-gray-900 dark:ring-gray-900':
            datePosition === 'top',
        }"
        style="top: var(--toolbar-height)"
      >
        <CalendarDate :date="new Date(key)" />
      </div>
      <div class="grid w-full grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
        <div v-for="book in group" :key="book.id">
          <AppBook
            :book="book"
            sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
          />
        </div>
      </div>
    </div>
  </UContainer>
</template>
