<script setup lang="ts">
import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";

const { t, locale, locales, setLocale } = useI18n({ useScope: "global" });
const toast = useToast();

type Locale = {
  id: string;
  label: string;
};

const availableLocales = computed(() => {
  return (locales.value as LocaleObject[]).map((l) => ({
    id: l.code,
    label: l.icon,
  }));
});

const currentLocale = ref<Locale | undefined>(
  availableLocales.value.find((i) => i.id === locale.value)
);

const changeLocale = async (v: Locale) => {
  await setLocale(v!.id);
  toast.add({
    icon: "i-fluent-local-language-20-filled",
    title: t("general.localeChanged"),
    description: t("general.localeChangedDescription"),
  });
};
</script>

<template>
  <USelectMenu
    v-model="currentLocale"
    :options="availableLocales"
    @update:model-value="changeLocale"
  />
</template>
