<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const { t } = useI18n({ useScope: "global" });

useSeoMeta({
  description: t("seo.description"),
  ogTitle: "Tana.moe",
  ogDescription: t("seo.description"),
  ogImage: runtimeConfig.public.ogUrl,
  ogImageAlt: "Tana.moe",
});
</script>

<template>
  <div class="space-y-24">
    <PageIndexSwiper />

    <UContainer>
      <AppRegisterBanner />
    </UContainer>

    <PageIndexRecentPosts />

    <PageIndexRecentBooks />
  </div>
</template>
