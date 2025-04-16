<script setup lang="ts">
const store = useSettingsStore();
</script>

<template>
  <UModal :title="$t('general.options')">
    <template #body>
      <FormSettingsDisplay
        v-model:book-details="store.display.bookDetails"
        v-model:book-price="store.display.bookPrice"
        v-model:editioned-book="store.display.editionedBook"
        v-model:digital="store.display.digital"
        v-model:date-position="store.display.datePosition"
        class="space-y-6"
      />
    </template>
  </UModal>
</template>
