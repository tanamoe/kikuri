<script setup lang="ts">
import { Collections } from "@/types/pb";
import { joinURL } from "ufo";

const { t } = useI18n();
const { $pb } = useNuxtApp();

const query = useRouteQuery("q", "");
const debounced = refDebounced(query, 500);
const page = useRouteQuery("p", "1", { transform: Number });
const perPage = useRouteQuery("limit", "48", { transform: Number });

const { data: publishers } = await useAsyncData(
  () =>
    $pb.collection(Collections.Publishers).getList(page.value, perPage.value, {
      filter: $pb.filter("name ~ {:name}", { name: debounced.value }),
    }),
  { watch: [debounced, page] },
);

const ui = {
  body: {
    base: "space-y-3 text-center",
  },
};

watchEffect(() => {
  if (publishers.value && publishers.value.totalPages < page.value)
    page.value = publishers.value.totalPages;
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
      <BrowseTypeDropdown>{{ $t("general.publisher") }}</BrowseTypeDropdown>
    </div>

    <div class="space-y-6">
      <UInput
        v-model="query"
        size="lg"
        icon="i-fluent-search-24-filled"
        :placeholder="$t('general.searchPlaceholder')"
      />
    </div>

    <template v-if="publishers">
      <AppGrid>
        <ULink
          v-for="publisher in publishers.items"
          :key="publisher.id"
          :to="joinURL('/publisher', publisher.slug)"
          class="group"
        >
          <UCard :ui>
            <img
              v-if="publisher.logo"
              :src="$pb.files.getUrl(publisher, publisher.logo)"
              class="inline-block h-20 w-20"
            />
            <div
              class="decoration-primary-400 text-lg decoration-2 group-hover:underline"
            >
              {{ publisher.name }}
            </div>
          </UCard>
        </ULink>
      </AppGrid>

      <UPagination
        v-model="page"
        class="justify-center"
        size="sm"
        :page-count="publishers.perPage"
        :total="publishers.totalItems"
        show-last
        show-first
      />
    </template>
  </div>
</template>
