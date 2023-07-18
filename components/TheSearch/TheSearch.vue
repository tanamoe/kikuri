<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSearchStore } from "@/stores/search";

const { $pb } = useNuxtApp();
const router = useRouter();
const { t } = useI18n({ useScope: "global" });
const search = useSearchStore();

const { isActive } = storeToRefs(search);

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
            .collection("title")
            .getFullList({ filter: `name ~ '${q}'` });
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

function onSelect(option: any) {
  if (option.click) {
    option.click();
  } else if (option.to) {
    router.push(option.to);
  } else if (option.href) {
    window.open(option.href, "_blank");
  }

  isActive.value = false;
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
  <UModal v-model="isActive">
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
