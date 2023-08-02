<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";

const { t } = useI18n({ useScope: "global" });
const store = useSettingsStore();

const { settings } = storeToRefs(store);

const digitalOptions = [
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
];

definePageMeta({
  layout: "setting",
});
</script>

<template>
  <div>
    <form ref="passwordForm" class="space-y-6">
      <UFormGroup name="showBookDetails" :label="$t('general.showBookDetails')">
        <UToggle v-model="settings.showBookDetails" />
      </UFormGroup>
      <UFormGroup name="digital" :label="$t('settings.showDigital')">
        <USelect
          v-model="settings.showDigital"
          :options="digitalOptions"
          option-attribute="name"
        />
      </UFormGroup>
    </form>
  </div>
</template>
