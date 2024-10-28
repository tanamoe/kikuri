<script setup lang="ts">
import type { ReleasesResponse, TitlesResponse } from "@/types/pb";
import type { AppBookProps } from "../book/AppBook.vue";

defineProps<{
  heading?: string;
  books: AppBookProps["book"][];
  release: ReleasesResponse;
  title: TitlesResponse;
  current?: string;
}>();

defineEmits<{
  add: [];
}>();

const ui = {
  wrapper: "mt-3",
  container: "py-1 gap-3",
  item: "basis-1/2 sm:basis-1/4 lg:basis-1/6 snap-start",
};
</script>

<template>
  <div class="space-y-3">
    <AppH3 v-if="heading">{{ heading }}</AppH3>
    <UCarousel
      v-slot="{ item: book }"
      :items="books"
      :ui
      :prev-button="{
        color: 'gray',
        icon: 'i-fluent-chevron-left-20-filled',
        class: 'z-10 rounded-md hidden md:flex',
      }"
      :next-button="{
        color: 'gray',
        icon: 'i-fluent-chevron-right-20-filled',
        class: 'z-10 rounded-md hidden md:flex',
      }"
      arrows
    >
      <AppBook
        :book
        :release
        :title
        :draggable="false"
        sizes="40vw, (min-width: 640px) 20vw, (min-width: 1280px) 10vw"
        @add="() => $emit('add')"
      />
    </UCarousel>
  </div>
</template>
