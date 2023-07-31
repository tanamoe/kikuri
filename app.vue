<!-- eslint-disable import/no-named-as-default-member -->
<script setup lang="ts">
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/vi";

import { useUserStore } from "@/stores/user";

dayjs.extend(localeData);
dayjs.locale("vi");

const { $pb } = useNuxtApp();
const i18nHead = useLocaleHead({
  addSeoAttributes: true,
});
const userStore = useUserStore();

await userStore.updateCurrentUser();
$pb.authStore.onChange(() => userStore.updateCurrentUser());

useHead({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang,
  },
  bodyAttrs: {
    class: "dark:bg-gray-900 bg-gray-50 text-gray-700 dark:text-gray-200",
  },
  link: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
  ],
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Tana.moe` : "Tana.moe";
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />

    <UNotifications />
  </NuxtLayout>
</template>
