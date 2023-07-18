<script setup lang="ts">
import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";

const { locale, locales, setLocale } = useI18n();

const availableLocales = computed(() => {
  return (locales.value as LocaleObject[]).map((l) => ({
    id: l.code,
    label: l.icon,
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
    @update:model-value="(v: typeof currentLocale) => setLocale(v!.id)"
  />
</template>
