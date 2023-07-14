<!-- eslint-disable import/no-named-as-default-member -->
<script setup lang="ts">
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/vi";

dayjs.extend(localeData);
dayjs.locale("vi");

const i18nHead = useLocaleHead({
  addSeoAttributes: true,
});

useHead({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang,
  },
  bodyAttrs: {
    class: "dark:bg-gray-900 bg-gray-50 text-gray-700 dark:text-gray-200",
  },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />

    <UNotifications />
  </NuxtLayout>
</template>
