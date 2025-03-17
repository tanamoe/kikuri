<script setup lang="ts">
const { t } = useI18n();

const model = defineModel<string>();

const options = computed(() => [
  {
    id: "none",
    label: t("settings.groupBy.none"),
  },
  {
    id: "release",
    label: t("settings.groupBy.release"),
  },
  {
    id: "status",
    label: t("settings.groupBy.status"),
  },
]);

const uiMenu = {
  width: "w-48",
};
</script>

<template>
  <USelectMenu
    v-model="model"
    :options
    value-attribute="id"
    option-attribute="label"
    :ui-menu
  >
    <UButton color="neutral" icon="i-fluent-group-list-20-filled">
      {{ $t("general.group") }}
    </UButton>
  </USelectMenu>
</template>
