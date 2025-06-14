<script setup lang="ts">
import type { APISearchResponse } from "@/types/api/search";
import { joinURL } from "ufo";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const query = ref("");

const { data, status, execute } = await useLazyAsyncData(
  () =>
    $pb.send<APISearchResponse>("/api/collections/titles/browse", {
      method: "POST",
      body: {
        name: query.value,
      },
      expand: "format",
    }),
  {
    transform: (data) =>
      data.items.map((title) => ({
        label: title.name,
        to: joinURL("/title", title.slug),
        suffix: title.format?.name,
        icon: "",
      })),
  },
);

const groups = computed(() => {
  if (!data?.value) {
    return [
      {
        id: "navigation",
        items: [
          {
            label: t("general.releaseCalendar"),
            icon: "i-fluent-calendar-20-filled",
            to: "/calendar",
          },
          {
            label: t("general.browse"),
            icon: "i-fluent-book-search-20-filled",
            to: "/browse",
          },
          {
            label: t("general.library"),
            icon: "i-fluent-library-20-filled",
            to: "/library",
          },
        ],
      },
      {
        id: "actions",
        items: [
          {
            label: t("general.settings"),
            icon: "i-fluent-settings-20-filled",
            to: "/settings",
          },
        ],
      },
    ];
  }

  return [
    {
      id: "title",
      label: t("general.searchResultFor", { query: query.value }),
      items: data.value,
      ignoreFilter: true,
    },
  ];
});

watchDebounced(
  [query],
  () => {
    execute();
  },
  { debounce: 500, maxWait: 1000 },
);
</script>

<template>
  <UModal>
    <template #content>
      <UCommandPalette
        v-model:search-term="query"
        :groups
        :placeholder="$t('general.searchPlaceholder')"
        :loading="status === 'pending'"
        icon="i-fluent-search-20-filled"
      >
        <template #empty-state>
          <div class="flex flex-col items-center justify-center gap-3 py-6">
            <UIcon name="i-fluent-search-20-regular" class="text-2xl" />
            <span class="text-sm">{{ $t("general.searchNoResult") }}</span>
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>
