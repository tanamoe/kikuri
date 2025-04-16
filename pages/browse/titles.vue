<script setup lang="ts">
import type { APISearchResponse } from "@/types/api/search";
import { Collections } from "@/types/pb";

const meta = useMeta();
const { t } = useI18n();
const { $pb } = useNuxtApp();

const query = useRouteQuery("q", "");
const debounced = refDebounced(query, 500);
const page = useRouteQuery("p", "1", { transform: Number });
const sort = useRouteQuery("s", "");
const perPage = useRouteQuery("limit", "48", { transform: Number });

const formats = useRouteQuery(
  "format",
  meta.formats.value.map(({ id }) => id),
  { transform: (value) => (Array.isArray(value) ? value : [value]) },
);

const demographics = useRouteQuery(
  "demographic",
  meta.demographics.value.map(({ id }) => id),
  { transform: (value) => (Array.isArray(value) ? value : [value]) },
);

const genres = useRouteQuery(
  "genre",
  meta.genres.value.map(({ id }) => id),
  { transform: (value) => (Array.isArray(value) ? value : [value]) },
);

const { data: titles, execute } = await useAsyncData(
  () =>
    $pb.send<APISearchResponse>("/api/collections/titles/browse", {
      method: "POST",
      body: {
        name: debounced.value,
        format: {
          kind: "or",
          values: formats.value,
        },
        demographic: {
          kind: "or",
          values: demographics.value,
        },
        genres: {
          kind: "or",
          values: genres.value,
        },
        sort: sort.value,
      },
      expand: "defaultRelease.front,format",
      perPage: perPage.value,
      page: page.value,
    }),
  { watch: [debounced, page, sort] },
);

function reset() {
  formats.value = meta.formats.value.map(({ id }) => id);
  demographics.value = meta.demographics.value.map(({ id }) => id);
  genres.value = meta.genres.value.map(({ id }) => id);
}

watchEffect(() => {
  if (titles.value && titles.value.totalPages < page.value)
    page.value = titles.value.totalPages;
  if (page.value === 0) page.value = 1;
});

watch(page, () => window.scrollTo({ top: 0, behavior: "smooth" }));

useSeoMeta({
  title: t("general.browse"),
  description: t("seo.browseDescription"),
  ogTitle: t("general.browse"),
  ogDescription: t("seo.browseDescription"),
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-1">
      <AppH1>{{ $t("general.browse") }}</AppH1>
      <BrowseTypeDropdown>{{ $t("general.title") }}</BrowseTypeDropdown>
    </div>

    <div class="space-y-6">
      <UInput
        v-model="query"
        size="lg"
        icon="i-fluent-search-24-filled"
        :placeholder="$t('general.searchPlaceholder')"
        class="w-full"
      />
      <div class="flex justify-between gap-3">
        <AppFilter
          v-model:formats="formats"
          v-model:demographics="demographics"
          v-model:genres="genres"
          @apply="execute"
          @reset="reset"
        />
        <AppSort v-model="sort" />
      </div>
    </div>

    <template v-if="titles">
      <AppGrid>
        <AppTitle
          v-for="title in titles.items"
          :key="title.id"
          :title
          :format="title.format"
          :image="
            title.defaultRelease?.front && {
              ...title.defaultRelease.front,
              collectionId: Collections.Assets,
            }
          "
        />
      </AppGrid>

      <UPagination
        v-model="page"
        class="justify-center"
        size="sm"
        :page-count="titles.perPage"
        :total="titles.totalItems"
        show-last
        show-first
      />
    </template>
  </div>
</template>
