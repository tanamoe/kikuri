<script setup lang="ts">
const { locale } = useI18n({ useScope: "global" });
</script>

<template>
  <div class="prose mx-auto dark:prose-invert prose-a:scroll-mt-16">
    <ContentDoc
      v-slot="{ doc }"
      :query="{ locale: locale }"
      path="privacy-policy"
    >
      <AppH1>{{ doc.title }}</AppH1>
      <ContentRenderer :value="doc" />
    </ContentDoc>
  </div>
</template>
