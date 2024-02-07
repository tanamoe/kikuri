<script setup lang="ts">
import type { DropdownItem } from "#ui/types";

const { t } = useI18n({ useScope: "global" });
const store = useSettingsStore();

const emit = defineEmits<{
  download: [void];
}>();

const isOpen = ref(false);

const options = computed<DropdownItem[][]>(() => [
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
      click: () => emit("download"),
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
          <UToggle v-model="store.display.bookDetails" />
        </UFormGroup>
        <UFormGroup name="showBookPrice" :label="$t('settings.showBookPrice')">
          <UToggle v-model="store.display.bookPrice" />
        </UFormGroup>
        <UFormGroup
          name="showEditionedBook"
          :label="$t('settings.showEditionedBook')"
        >
          <UToggle v-model="store.display.editionedBook" />
        </UFormGroup>
        <UFormGroup name="digital" :label="$t('settings.showDigital')">
          <USelect
            v-model="store.display.digital"
            :options="digitalOptions"
            option-attribute="name"
          />
        </UFormGroup>
        <UFormGroup name="datePosition" :label="$t('settings.datePosition')">
          <USelect
            v-model="store.display.datePosition"
            :options="positionOptions"
            option-attribute="name"
          />
        </UFormGroup>
      </div>
    </UModal>
  </div>
</template>
