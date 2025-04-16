<script setup lang="ts">
const { t } = useI18n();
const model = defineModel<string>();

const items = computed(() => [
  {
    id: "-updated",
    label: t("sort.latest"),
  },
  {
    id: "updated",
    label: t("sort.oldest"),
  },
  {
    id: "-name",
    label: t("sort.nameAscending"),
  },
  {
    id: "name",
    label: t("sort.nameDescending"),
  },
]);
</script>

<template>
  <USelectMenu
    v-model="model"
    :items
    :search-input="false"
    value-key="id"
    class="w-48"
  >
    {{ $t("general.sort") }}
  </USelectMenu>
</template>
