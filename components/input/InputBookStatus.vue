<script setup lang="ts">
import type { CollectionBooksStatusOptions } from "@/types/pb";

const { collectionBookStatus: items } = useOptions();

const model = defineModel<keyof typeof CollectionBooksStatusOptions>();

const current = computed(() => items.value.find((s) => s.id === model.value));
</script>

<template>
  <USelectMenu v-model="model" :items value-key="id" option-key="label">
    <span v-if="current">
      {{ current.label }}
    </span>
    <span v-else>
      {{ $t("general.statusSelect") }}
    </span>
  </USelectMenu>
</template>
