<script setup lang="ts">
const { ogUrl, umamiUrl, umamiSiteId, fbAppId } = useRuntimeConfig().public;
const i18nHead = useLocaleHead({
  addSeoAttributes: true,
});
const { $pb } = useNuxtApp();
const { update } = useLibrary();

onMounted(() => {
  $pb.authStore.onChange(update, true);
});

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
      src: umamiUrl,
      "data-website-id": umamiSiteId,
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
  ogImage: ogUrl,
  ogImageAlt: "Tana.moe",
  ogImageHeight: "630",
  ogImageWidth: "1200",
  themeColor: "#89c4f4",
  twitterSite: "@tanamoeeee",
  twitterCard: "summary_large_image",
  fbAppId,
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="#89C4F4" />

    <NuxtLayout>
      <NuxtPage />

      <UNotifications />
      <SearchBar />

      <UModals />
    </NuxtLayout>
  </div>
</template>
