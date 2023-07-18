<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";

const { t } = useI18n({ useScope: "global" });
const store = useSettingsStore();

const isOpen = ref(false);
const { settings } = storeToRefs(store);

const options = [
  [
    {
      label: t("general.print"),
      icon: "i-fluent-print-20-filled",
      disabled: true,
    },
    {
      label: t("general.download"),
      icon: "i-fluent-arrow-download-20-filled",
      disabled: true,
    },
  ],
  [
    {
      label: t("general.options"),
      icon: "i-fluent-options-20-filled",
      click: () => (isOpen.value = true),
    },
  ],
];

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
</script>

<template>
  <div>
    <UDropdown :items="options" :popper="{ placement: 'bottom-start' }">
      <UButton color="gray" icon="i-fluent-more-vertical-20-filled" square />
    </UDropdown>

    <UModal v-model="isOpen">
      <div class="space-y-6 p-6">
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
      </div>
    </UModal>
  </div>
</template>
