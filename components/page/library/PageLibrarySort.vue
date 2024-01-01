<script setup lang="ts">
const { t } = useI18n({ useScope: "global" });

const state = defineModel<string>();

const options = computed(() => [
  {
    id: "+name",
    label: t("sort.nameAscending"),
  },
  {
    id: "-name",
    label: t("sort.nameDescending"),
  },
  {
    id: "+updated",
    label: t("sort.latest"),
  },
  {
    id: "-updated",
    label: t("sort.oldest"),
  },
]);

const uiMenu = {
  width: "w-48",
};
</script>

<template>
  <USelectMenu
    v-model="state"
    :options="options"
    class="flex-shrink-0"
    :ui-menu="uiMenu"
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
