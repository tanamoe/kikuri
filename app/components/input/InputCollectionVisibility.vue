<script setup lang="ts">
import type { CollectionsVisibilityOptions } from "@/types/pb";

const { collectionVisibility: items } = useOptions();

const visibility = defineModel<keyof typeof CollectionsVisibilityOptions>();

const current = computed(() =>
  items.value.find((s) => s.id === visibility.value),
);
</script>

<template>
  <USelectMenu v-model="visibility" :items value-key="id" option-key="label">
    <template #leading>
      <UIcon v-if="current?.icon" :name="current.icon" class="mx-0.5 h-4 w-4" />
      <UIcon v-else name="i-fluent-shield-20-filled" class="mx-0.5 h-4 w-4" />
    </template>

    <span v-if="current">
      {{ current.label }}
    </span>
    <span v-else>{{ $t("library.selectVisibility") }}</span>
  </USelectMenu>
</template>
