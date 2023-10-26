<script setup lang="ts">
import {
  type BookDetailsResponse,
  type PublicationsResponse,
  type ReleasesResponse,
  type TitlesResponse,
} from "@/types/pb";
import type { MetadataCommon } from "@/types/common";

defineProps<{
  book: BookDetailsResponse<
    MetadataCommon,
    string,
    {
      publication: Pick<PublicationsResponse, "name">;
      release: Pick<
        ReleasesResponse<{
          title: TitlesResponse;
        }>,
        "expand" | "title"
      >;
    }
  >;
}>();
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
    <h2 class="mb-6 line-clamp-3 font-lexend text-3xl">
      {{ book.expand?.publication.name }}
    </h2>
    <div>
      <p class="mb-6 text-gray-500 dark:text-gray-300">
        <span>
          <b>{{ $t("general.publishedBy") }}</b>
          {{ book.expand?.release.expand?.title }}
        </span>
        <br />
        <span v-if="book.price !== 0">
          <b>{{ $t("general.bookPrice") }}</b>
          {{ $n(book.price, "currency", "vi") }}
        </span>
      </p>
      <UButton
        :to="`/title/${book.expand?.release.title}`"
        icon="i-fluent-info-20-filled"
        color="gray"
      >
        {{ $t("general.viewTitleDetails") }}
      </UButton>
    </div>
  </div>
</template>
