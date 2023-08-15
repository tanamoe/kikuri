<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";

const { t } = useI18n({ useScope: "global" });
const store = useSettingsStore();

const {
  showBookDetails,
  showBookPrice,
  showDigital,
  showEditionedBook,
  datePosition,
} = storeToRefs(store);

const digitalOptions = computed(() => [
  {
    name: t("settings.digital.show"),
    value: "show",
  },
  {
    name: t("settings.digital.hide"),
    value: "hide",
  },
  {
    name: t("settings.digital.only"),
    value: "only",
  },
]);

const positionOptions = computed(() => [
  {
    name: t("settings.position.left"),
    value: "left",
  },
  {
    name: t("settings.position.top"),
    value: "top",
  },
]);

definePageMeta({
  layout: "setting",
});
</script>

<template>
  <form class="space-y-6">
    <UFormGroup name="showBookDetails" :label="$t('settings.showBookDetails')">
      <UToggle v-model="showBookDetails" />
    </UFormGroup>
    <UFormGroup name="showBookPrice" :label="$t('settings.showBookPrice')">
      <UToggle v-model="showBookPrice" />
    </UFormGroup>
    <UFormGroup
      name="showEditionedBook"
      :label="$t('settings.showEditionedBook')"
    >
      <UToggle v-model="showEditionedBook" />
    </UFormGroup>
    <UFormGroup name="digital" :label="$t('settings.showDigital')">
      <USelect
        v-model="showDigital"
        :options="digitalOptions"
        option-attribute="name"
      />
    </UFormGroup>
    <UFormGroup name="datePosition" :label="$t('settings.datePosition')">
      <USelect
        v-model="datePosition"
        :options="positionOptions"
        option-attribute="name"
      />
    </UFormGroup>
  </form>
</template>
