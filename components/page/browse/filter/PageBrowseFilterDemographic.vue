<script setup lang="ts">
import { Collections } from "@/types/pb";

const { $pb } = useNuxtApp();
const store = useBrowseStore();

const { data: demographics, pending } = await useLazyAsyncData(
  () => $pb.collection(Collections.Demographics).getFullList(),
  {
    transform: (demographics) =>
      demographics.map(({ slug, name }) => ({
        id: slug,
        label: name,
      })),
    default: () => [],
  },
);
</script>

<template>
  <USelectMenu
    v-model="store.demographics"
    :options="demographics"
    multiple
    value-attribute="id"
    :loading="pending"
  >
    <template #label>
      <span v-if="store.demographics.length > 0" class="truncate">
        {{
          $t("general.demographicCount", { count: store.demographics.length })
        }}
      </span>
      <span v-else class="truncate">
        {{ $t("general.demographicSelect") }}
      </span>
    </template>
  </USelectMenu>
</template>
