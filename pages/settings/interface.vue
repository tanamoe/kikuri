<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";

const store = useSettingsStore();

const { settings } = storeToRefs(store);

definePageMeta({
  layout: "setting",
});
</script>

<template>
  <div>
    <form ref="passwordForm" class="space-y-6" @submit.prevent="">
      <UFormGroup
        name="showBookDetails"
        :label="$t('interface.showBookDetails')"
      >
        <UToggle v-model="settings.showBookDetails" />
      </UFormGroup>
    </form>
  </div>
</template>
