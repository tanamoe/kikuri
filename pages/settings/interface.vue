<script setup lang="ts">
const store = useSettingsStore();

definePageMeta({
  layout: "setting",
});
</script>

<template>
  <section class="space-y-6">
    <AppH2>{{ $t("general.releaseCalendar") }}</AppH2>
    <FormSettingsDisplay
      v-model:book-details="store.display.bookDetails"
      v-model:book-price="store.display.bookPrice"
      v-model:editioned-book="store.display.editionedBook"
      v-model:digital="store.display.digital"
      v-model:date-position="store.display.datePosition"
      class="space-y-6"
    />

    <AppH2>{{ $t("general.title") }}</AppH2>
    <UFormField name="showMetadata" :label="$t('settings.showMetadata')">
      <USwitch v-model="store.display.bookMetadata" />
    </UFormField>
  </section>
</template>
