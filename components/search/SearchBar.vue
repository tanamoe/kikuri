<script setup lang="ts">
import { Collections, type TitlesResponse } from "@/types/pb";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const { isActive, close } = useSearch();

const groups = computed(() => {
  return [
    {
      key: "title",
      label: (q: string) => {
        if (q) return t("general.searchResultFor", { query: q });
      },
      commands: [],
      search: async (q: string) => {
        if (!q) {
          return [];
        }

        const { data } = await useAsyncData(() => {
          return $pb
            .collection(Collections.Titles)
            .getFullList<TitlesResponse>({ filter: `name ~ '${q}'` });
        });

        if (data.value == null) return [];

        return data.value.map((title) => ({
          id: title.id,
          label: title.name,
          to: `/title/${title.id}`,
        }));
      },
    },
  ];
});

const ui = computed(() => ({
  container:
    "flex min-h-full items-start sm:items-center justify-center text-center",
}));

async function onSelect(option: any) {
  if (option.click) {
    option.click();
  } else if (option.to) {
    await navigateTo(option.to);
  } else if (option.href) {
    await navigateTo(option.href, { external: true });
  }

  close();
}

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isActive.value = !isActive.value;
    },
  },
});
</script>

<template>
  <UModal v-model="isActive" :ui="ui">
    <UCommandPalette
      :groups="groups"
      :placeholder="$t('general.searchPlaceholder')"
      @update:model-value="onSelect"
    >
      <template #empty-state>
        <div class="flex flex-col items-center justify-center gap-3 py-6">
          <UIcon name="i-fluent-search-20-regular" class="text-2xl" />
          <span class="text-sm">{{ $t("general.searchNoResult") }}</span>
        </div>
      </template>
    </UCommandPalette>
  </UModal>
</template>
