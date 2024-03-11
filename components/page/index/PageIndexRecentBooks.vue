<script setup lang="ts">
import { Collections } from "@/types/pb";
import type { BookDetailsCommon } from "@/types/common";

const { $pb } = useNuxtApp();

const { data: books } = await useLazyAsyncData(() =>
  $pb.collection(Collections.BookDetails).getList<BookDetailsCommon>(1, 6, {
    expand: "publication,release,release.title",
    sort: "-updated",
  }),
);
</script>

<template>
  <div v-if="books">
    <UContainer class="mb-6">
      <NuxtLink to="/browse">
        <AppH3
          class="flex items-center gap-3 underline decoration-tanablue-400 decoration-[.2rem] underline-offset-[.2rem]"
        >
          <img
            src="/icon.svg"
            class="h-6"
            height="24"
            width="24"
            alt="Tana.moe logo"
          />
          {{ $t("general.justUpdatedBooks") }}
        </AppH3>
      </NuxtLink>
    </UContainer>
    <div
      class="mx-auto flex snap-x snap-mandatory gap-6 overflow-x-scroll sm:container sm:grid sm:grid-cols-3 sm:overflow-x-hidden sm:px-6 lg:grid-cols-6"
    >
      <div
        v-for="(book, i) in books.items"
        :key="book.id"
        :class="[
          'w-1/3 flex-shrink-0 snap-start scroll-ml-6 sm:w-full',
          i === 0 && 'ml-6 sm:ml-0',
          i === books.items.length - 1 && 'mr-6 sm:mr-0',
        ]"
      >
        <AppBook
          :book="book"
          sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
          :show-button="false"
        />
      </div>
    </div>
  </div>
</template>
