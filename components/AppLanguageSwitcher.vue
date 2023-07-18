<script setup lang="ts">
import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";

const { locale, locales, setLocale } = useI18n();

const availableLocales = computed(() => {
  return locales.value.map((l) => ({
    id: (l as LocaleObject).code,
    label: (l as LocaleObject).icon,
  }));
});

const currentLocale = ref(
  availableLocales.value.find((i) => i.id === locale.value)
);
</script>

<template>
  <USelectMenu
    v-model="currentLocale"
    :options="availableLocales"
    @update:model-value="(v) => setLocale(v.id)"
  />
</template>
