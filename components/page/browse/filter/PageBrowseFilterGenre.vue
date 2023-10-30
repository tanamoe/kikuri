<script setup lang="ts">
import { Collections } from "@/types/pb";

const { $pb } = useNuxtApp();
const store = useBrowseStore();

const { data: genres, pending } = await useLazyAsyncData(
  () => $pb.collection(Collections.Genres).getFullList(),
  {
    transform: (genres) =>
      genres.map((genre) => ({
        id: genre.id,
        label: genre.name,
      })),
    default: () => [],
  },
);

const selected = computed(() => {
  if (genres.value) {
    return genres.value.filter((g) => store.genres.includes(g.id));
  }
});
</script>

<template>
  <USelectMenu
    v-model="store.genres"
    :options="genres"
    multiple
    searchable
    value-attribute="id"
    :searchable-placeholder="$t('general.searchPlaceholder')"
    :loading="pending"
  >
    <template #label>
      <template v-if="selected && selected.length > 0">
        <span class="truncate">
          {{ $t("general.genreCount", { count: store.genres.length }) }}
        </span>
      </template>
      <span v-else class="truncate">{{ $t("general.genreSelect") }}</span>
    </template>
  </USelectMenu>
</template>
