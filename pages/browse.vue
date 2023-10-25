<script setup lang="ts">
import {
  Collections,
  type TitlesResponse,
  type ReleasesResponse,
} from "~/types/pb";

const { $pb } = useNuxtApp();

const query = ref("");
const queryDebounced = refDebounced(query, 500);
const page = ref(1);

const filter = computed(() => ({
  name: queryDebounced.value,
}));

const { data: releases, pending } = await useAsyncData(
  () =>
    $pb.collection(Collections.Releases).getList<
      ReleasesResponse<{
        title: TitlesResponse;
      }>
    >(page.value, 24, {
      filter: $pb.filter("title.name ~ {:name}", filter.value),
      expand: "title",
    }),
  {
    watch: [filter],
  },
);
</script>

<template>
  <UContainer>
    <AppH1 class="mb-6">{{ $t("general.browse") }}</AppH1>
    <UInput
      v-model="query"
      size="lg"
      icon="i-fluent-search-24-filled"
      :placeholder="$t('general.searchPlaceholder')"
    />

    <div v-if="pending" class="mt-12 grid grid-cols-6 gap-6">
      <div v-for="i in 24" :key="i">
        <USkeleton class="aspect-[2/3] h-full w-full" />
      </div>
    </div>
    <div v-else-if="releases" class="mt-12 grid grid-cols-6 gap-6">
      <AppRelease
        v-for="release in releases.items"
        :key="release.id"
        :release="release"
      />
    </div>
  </UContainer>
</template>
