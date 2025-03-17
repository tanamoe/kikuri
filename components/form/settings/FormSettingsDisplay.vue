<script setup lang="ts">
const { t } = useI18n();

const bookDetails = defineModel<boolean>("bookDetails");
const bookPrice = defineModel<boolean>("bookPrice");
const editionedBook = defineModel<boolean>("editionedBook");
const digital = defineModel<DisplaySettings["digital"]>("digital");
const datePosition =
  defineModel<DisplaySettings["datePosition"]>("datePosition");

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
  <form class="space-y-6">
    <UFormField name="showBookDetails" :label="$t('settings.showBookDetails')">
      <USwitch v-model="bookDetails" />
    </UFormField>
    <UFormField name="showBookPrice" :label="$t('settings.showBookPrice')">
      <USwitch v-model="bookPrice" />
    </UFormField>
    <UFormField
      name="showEditionedBook"
      :label="$t('settings.showEditionedBook')"
    >
      <USwitch v-model="editionedBook" />
    </UFormField>
    <UFormField name="digital" :label="$t('settings.showDigital')">
      <USelect
        v-model="digital"
        class="min-w-72"
        :items="digitalOptions"
        label-key="name"
        value-key="value"
      />
    </UFormField>
    <UFormField name="datePosition" :label="$t('settings.datePosition')">
      <USelect
        v-model="datePosition"
        class="min-w-72"
        :items="positionOptions"
        label-key="name"
        value-key="value"
      />
    </UFormField>
  </form>
</template>
