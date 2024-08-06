<script setup lang="ts">
const { t } = useI18n();

const query = defineModel<string>("query");
const group = defineModel<LibrarySettings["groupBy"]>("group");

const groups = [
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
];

const uiMenu = {
  width: "w-48",
};
</script>

<template>
  <div class="flex gap-3">
    <UInput v-model="query" class="flex-1" :placeholder="t('general.search')" />
    <USelectMenu
      v-model="group"
      :options="groups"
      value-attribute="id"
      option-attribute="label"
      :ui-menu
    >
      <UButton color="gray" icon="i-fluent-group-list-20-filled">
        {{ $t("general.group") }}
      </UButton>
    </USelectMenu>
  </div>
</template>
