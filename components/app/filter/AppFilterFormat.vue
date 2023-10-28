<script setup lang="ts">
defineProps<{
  formats: {
    id: string;
    label: string;
  }[];
}>();

const store = useAdvancedFilterStore();
const { formats: selected } = storeToRefs(store);
</script>

<template>
  <USelectMenu
    v-model="selected"
    :options="formats"
    multiple
    :placeholder="$t('general.formatSelect')"
  />
</template>
