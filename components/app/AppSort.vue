<script setup lang="ts">
const { t } = useI18n();
const model = defineModel<string>();

const options = computed(() => [
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
    :options
    class="flex-shrink-0"
    :ui-menu="{
      width: 'w-48',
    }"
    value-attribute="id"
  >
    <UButton
      color="gray"
      class="flex-1 justify-between"
      icon="i-fluent-arrow-sort-down-lines-20-filled"
    >
      {{ $t("general.sort") }}
    </UButton>
  </USelectMenu>
</template>
