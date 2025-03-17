<script setup lang="ts">
import type { APISearchReleaseResponse } from "@/types/api/search";
import { Collections, type ReleasesStatusOptions } from "@/types/pb";

const meta = useMeta();
const { t } = useI18n();
const { $pb } = useNuxtApp();

const query = useRouteQuery("q", "");
const debounced = refDebounced(query, 500);
const page = useRouteQuery("p", "1", { transform: Number });
const sort = useRouteQuery("s", "");
const perPage = useRouteQuery("limit", "48", { transform: Number });

const status = useRouteQuery<ReleasesStatusOptions>("status", undefined);

const publishers = useRouteQuery(
  "publisher",
  meta.publishers.value.map(({ id }) => id),
  { transform: (value) => (Array.isArray(value) ? value : [value]) },
);

const { data: releases, execute } = await useAsyncData(
  () =>
    $pb.send<APISearchReleaseResponse>("/api/collections/releases/browse", {
      method: "POST",
      body: {
        name: debounced.value,
        publisher: {
          kind: "or",
          values: publishers.value,
        },
        status: status.value,
        sort: sort.value,
      },
      expand: "front,title.format,publisher,partner",
      perPage: perPage.value,
      page: page.value,
    }),
  { watch: [debounced, page, sort] },
);

function reset() {
  publishers.value = meta.publishers.value.map(({ id }) => id);
}

watchEffect(() => {
  if (releases.value && releases.value.totalPages < page.value)
    page.value = releases.value.totalPages;
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
      <BrowseTypeDropdown>{{ $t("general.release") }}</BrowseTypeDropdown>
    </div>

    <div class="space-y-6">
      <UInput
        v-model="query"
        size="lg"
        icon="i-fluent-search-24-filled"
        :placeholder="$t('general.searchPlaceholder')"
      />
      <div class="flex justify-between gap-3">
        <AppFilter
          v-model:status="status"
          v-model:publishers="publishers"
          @apply="execute"
          @reset="reset"
        />
        <AppSort v-model="sort" />
      </div>
    </div>

    <template v-if="releases">
      <AppGrid>
        <template v-for="release in releases.items" :key="release.id">
          <AppRelease
            v-if="release.title"
            :release
            :title="release.title"
            :format="release.title.format"
            :publisher="
              release.publisher && {
                ...release.publisher,
                collectionId: Collections.Publishers,
              }
            "
            :partner="
              release.partner && {
                ...release.partner,
                collectionId: Collections.Publishers,
              }
            "
            :image="
              release.front && {
                ...release.front,
                collectionId: Collections.Assets,
              }
            "
          />
        </template>
      </AppGrid>

      <UPagination
        v-model="page"
        class="justify-center"
        size="sm"
        :page-count="releases.perPage"
        :total="releases.totalItems"
        show-last
        show-first
      />
    </template>
  </div>
</template>
