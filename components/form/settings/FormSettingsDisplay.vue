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
    <UFormGroup name="showBookDetails" :label="$t('settings.showBookDetails')">
      <UToggle v-model="bookDetails" />
    </UFormGroup>
    <UFormGroup name="showBookPrice" :label="$t('settings.showBookPrice')">
      <UToggle v-model="bookPrice" />
    </UFormGroup>
    <UFormGroup
      name="showEditionedBook"
      :label="$t('settings.showEditionedBook')"
    >
      <UToggle v-model="editionedBook" />
    </UFormGroup>
    <UFormGroup name="digital" :label="$t('settings.showDigital')">
      <USelect
        v-model="digital"
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
