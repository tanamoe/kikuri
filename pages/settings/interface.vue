<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";

const { t } = useI18n({ useScope: "global" });
const store = useSettingsStore();

const { settings } = storeToRefs(store);

const digitalOptions = [
  {
    name: t("calendar.showDigital"),
    value: "show",
  },
  {
    name: t("calendar.hideDigital"),
    value: "hide",
  },
  {
    name: t("calendar.onlyDigital"),
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
      <UFormGroup
        name="showBookDetails"
        :label="$t('interface.showBookDetails')"
      >
        <UToggle v-model="settings.showBookDetails" />
      </UFormGroup>
      <UFormGroup name="digital" :label="$t('calendar.digitalOptions')">
        <USelect
          v-model="settings.showDigital"
          :options="digitalOptions"
          option-attribute="name"
        />
      </UFormGroup>
    </form>
  </div>
</template>
