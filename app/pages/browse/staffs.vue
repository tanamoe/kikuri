<script setup lang="ts">
import { Collections } from "@/types/pb";
import { joinURL } from "ufo";

const { t } = useI18n();
const { $pb } = useNuxtApp();

const query = useRouteQuery("q", "");
const debounced = refDebounced(query, 500);
const page = useRouteQuery("p", "1", { transform: Number });
const sort = useRouteQuery("s", "");
const perPage = useRouteQuery("limit", "48", { transform: Number });

const { data: staffs } = await useAsyncData(
  () =>
    $pb.collection(Collections.Staffs).getList(page.value, perPage.value, {
      filter: $pb.filter("name ~ {:name}", { name: debounced.value }),
    }),
  { watch: [debounced, page, perPage, sort] },
);

const ui = {
  body: "space-y-3 text-center",
};

watchEffect(() => {
  if (staffs.value && staffs.value.totalPages < page.value)
    page.value = staffs.value.totalPages;
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
      <BrowseTypeDropdown>{{ $t("general.staff") }}</BrowseTypeDropdown>
    </div>

    <div class="space-y-6">
      <UInput
        v-model="query"
        size="lg"
        icon="i-fluent-search-24-filled"
        :placeholder="$t('general.searchPlaceholder')"
        class="w-full"
      />
    </div>

    <template v-if="staffs">
      <AppGrid>
        <ULink
          v-for="staff in staffs.items"
          :key="staff.id"
          :to="joinURL('/staff', staff.id)"
          class="group"
        >
          <UCard :ui>
            <div
              class="decoration-primary-400 text-lg decoration-2 group-hover:underline"
            >
              {{ staff.name }}
            </div>
          </UCard>
        </ULink>
      </AppGrid>

      <UPagination
        v-model="page"
        class="justify-center"
        size="sm"
        :page-count="staffs.perPage"
        :total="staffs.totalItems"
        show-last
        show-first
      />
    </template>
  </div>
</template>
