<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";

const { t } = useI18n({ useScope: "global" });
const store = useSettingsStore();

const isOpen = ref(false);
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
</script>

<template>
  <div>
    <UButton
      color="gray"
      icon="i-fluent-options-20-filled"
      @click="isOpen = true"
    >
      {{ $t("general.options") }}
    </UButton>

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
