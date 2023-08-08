<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";

const { t } = useI18n({ useScope: "global" });
const store = useSettingsStore();

const isOpen = ref(false);
const { showBookDetails, showBookPrice, showDigital, showEditionedBook } =
  storeToRefs(store);

const options = computed(() => [
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
]);

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
          :label="$t('settings.showBookDetails')"
        >
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
      </div>
    </UModal>
  </div>
</template>
