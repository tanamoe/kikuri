<script setup lang="ts">
import type { Command, Group } from "#ui/types";
import type { UCommandPalette } from "#build/components";
import type { APISearchResponse } from "@/types/api/search";
import { joinURL } from "ufo";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const { isActive, close } = useSearch();

const commandPalletteRef = ref<typeof UCommandPalette>();

async function search(query: string) {
  if (!query) {
    return [];
  }

  try {
    const result = await $pb.send<APISearchResponse>(
      "/api/collections/titles/browse",
      {
        method: "POST",
        body: {
          name: query,
        },
        expand: "format",
      },
    );
    return result.items.map((title) => ({
      id: title.id,
      label: title.name,
      to: joinURL("/title", title.slug || ""),
      prefix: title.format?.name,
    })) as Command[];
  } catch (e) {
    return [];
  }
}

const groups = computed(() => {
  if (!commandPalletteRef.value?.query) {
    return [
      {
        key: "navigation",
        commands: [
          {
            id: "calendar",
            label: t("general.releaseCalendar"),
            icon: "i-fluent-calendar-20-filled",
            to: "/calendar",
          },
          {
            id: "browse",
            label: t("general.browse"),
            icon: "i-fluent-book-search-20-filled",
            to: "/browse",
          },
          {
            id: "library",
            label: t("general.library"),
            icon: "i-fluent-library-20-filled",
            to: "/library",
          },
        ],
      },
      {
        key: "actions",
        commands: [
          {
            id: "settings",
            label: t("general.settings"),
            icon: "i-fluent-settings-20-filled",
            to: "/settings",
          },
        ],
      },
    ] as Group[];
  }

  return [
    {
      key: "title",
      label: (q: string) => {
        if (q) return t("general.searchResultFor", { query: q });
      },
      commands: [],
      search,
    },
  ];
});

const ui = computed(() => ({
  container:
    "flex min-h-full items-start sm:items-center justify-center text-center",
}));

async function onSelect(option: Command) {
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
      ref="commandPalletteRef"
      :groups="groups"
      :placeholder="$t('general.searchPlaceholder')"
      :autoselect="false"
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
