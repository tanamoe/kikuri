<script setup lang="ts">
import type { CollectionBookResponse } from "@/types/api/collections";

const props = defineProps<{
  groups: Partial<Record<string, CollectionBookResponse[]>>;
  editable: boolean;
  callback?: () => unknown;
}>();

const items = computed(() =>
  Object.entries(props.groups).map(([key, group]) => ({
    label: key,
    slot: key,
    group: group,
  })),
);
</script>

<template>
  <UAccordion default-open multiple color="neutral" variant="ghost" :items>
    <template v-for="item in items" :key="item.slot" #[item.slot]>
      <LibraryBooksList
        v-if="item.group"
        :id="item.slot"
        class="scroll-mt-24"
        :editable
        :books="item.group"
        :callback
      />
    </template>
  </UAccordion>
</template>
