<script setup lang="ts">
defineProps<{
  publishers: {
    id: string;
    label: string;
  }[];
}>();

const store = useAdvancedFilterStore();
const { publishers: selected } = storeToRefs(store);
</script>

<template>
  <USelectMenu
    v-model="selected"
    :options="publishers"
    multiple
    :placeholder="$t('general.publisherSelect')"
  />
</template>
