<script setup lang="ts">
const { t, locale } = useI18n({ useScope: "global" });

const { data } = await useAsyncData(() =>
  queryCollection("content").path(`/${locale.value}/missing-entries`).first(),
);

if (!data)
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });
</script>

<template>
  <div v-if="data" class="prose mx-auto dark:prose-invert">
    <AppH1>{{ data.title }}</AppH1>
    <ContentRenderer :value="data" />
  </div>
</template>
