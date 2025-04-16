<script setup lang="ts">
const { t } = useI18n();

const model = defineModel<number>();

const items = computed(() => [
  {
    count: 12,
    label: t("general.bookCount", { count: 12 }),
  },
  {
    count: 24,
    label: t("general.bookCount", { count: 24 }),
  },
  {
    count: 36,
    label: t("general.bookCount", { count: 36 }),
  },
  {
    count: 48,
    label: t("general.bookCount", { count: 48 }),
  },
  {
    count: 60,
    label: t("general.bookCount", { count: 60 }),
  },
]);
</script>

<template>
  <USelectMenu v-model="model" :items :search-input="false" value-key="count" />
</template>
