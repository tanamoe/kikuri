<script setup lang="ts">
import { joinURL } from "ufo";
import type { BooksCommon } from "@/types/common";

const props = defineProps<{
  book: BooksCommon;
}>();

const publication = props.book.expand?.publication;
const release = publication?.expand?.release;
const publisher = release?.expand?.publisher;
const partner = release?.expand?.partner;
const title = release?.expand?.title;
</script>

<template>
  <div class="h-72 w-full">
    <div v-if="book.publishDate" class="mb-3">
      {{
        $t("general.dateRelease", {
          date: $d(new Date(book.publishDate)),
        })
      }}
    </div>
    <h2 v-if="publication" class="font-lexend mb-6 line-clamp-3 text-3xl">
      {{ publication.name }}
    </h2>
    <div>
      <p class="mb-6 text-neutral-500 dark:text-neutral-300">
        <span v-if="publisher">
          <b>{{ $t("general.publishedBy") }}</b>
          {{ partner?.name ?? publisher.name }}
        </span>
        <br />
        <span v-if="book.price !== 0">
          <b>{{ $t("general.bookPrice") }}</b>
          {{ $n(book.price, "currency", "vi") }}
        </span>
      </p>
      <UButton
        v-if="title"
        :to="joinURL('/title', title.slug)"
        icon="i-fluent-info-20-filled"
        color="neutral"
      >
        {{ $t("general.viewTitleDetails") }}
      </UButton>
    </div>
  </div>
</template>
