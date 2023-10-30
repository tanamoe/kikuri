<script setup lang="ts">
import { Collections } from "@/types/pb";

const { $pb } = useNuxtApp();
const store = useBrowseStore();

const { data: formats, pending } = await useLazyAsyncData(
  () => $pb.collection(Collections.Formats).getFullList(),
  {
    transform: (formats) =>
      formats.map(({ id, name }) => ({
        id,
        label: name,
      })),
    default: () => [],
  },
);
</script>

<template>
  <USelectMenu
    v-model="store.formats"
    :options="formats"
    multiple
    value-attribute="id"
    :loading="pending"
  >
    <template #label>
      <span v-if="store.formats.length > 0" class="truncate">
        {{ $t("general.formatCount", { count: store.formats.length }) }}
      </span>
      <span v-else>
        {{ $t("general.formatSelect") }}
      </span>
    </template>
  </USelectMenu>
</template>
