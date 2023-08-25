<!-- eslint-disable import/no-named-as-default-member -->
<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const runtimeConfig = useRuntimeConfig();
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
  script: [
    {
      async: true,
      src: runtimeConfig.public.umamiUrl,
      "data-website-id": runtimeConfig.public.umamiSiteId,
    },
  ],
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

useSeoMeta({
  ogSiteName: "Tana.moe",
  ogLocale: "vi_VN",
  ogType: "website",
  ogImageHeight: "630",
  ogImageWidth: "1200",
  themeColor: "#89c4f4",
  twitterSite: "@tanamoeeee",
  twitterCard: "summary_large_image",
  fbAppId: runtimeConfig.public.fbAppId,
});
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="#89C4F4" />

    <NuxtPage />

    <UNotifications />
  </NuxtLayout>
</template>
