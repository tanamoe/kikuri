<script setup lang="ts">
import { Collections, type TitlesResponse } from "~/types/pb";

const { $pb } = useNuxtApp();

const query = ref("");
const queryDebounced = refDebounced(query, 500);
const page = ref(1);

const filter = computed(() => ({
  name: queryDebounced.value,
}));

const { data: titles, pending } = await useAsyncData(
  () =>
    $pb.collection(Collections.Titles).getList<TitlesResponse>(page.value, 24, {
      filter: $pb.filter("name ~ {:name}", filter.value),
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
    <div class="mt-6 flex justify-between">
      <AppFilterAdvanced />
      <USelect
        :placeholder="$t('general.sortBy')"
        icon="i-fluent-arrow-sort-down-lines-20-filled"
      />
    </div>

    <div v-if="pending" class="mt-6 grid grid-cols-6 gap-x-6 gap-y-12">
      <div v-for="i in 24" :key="i">
        <USkeleton class="aspect-[2/3] h-full w-full" />
      </div>
    </div>

    <div v-else-if="titles" class="mt-6 grid grid-cols-6 gap-x-6 gap-y-12">
      <AppTitle v-for="title in titles.items" :key="title.id" :title="title" />
    </div>
  </UContainer>
</template>
