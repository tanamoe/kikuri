<script setup lang="ts">
const { locale } = useI18n({ useScope: "global" });
</script>

<template>
  <UContainer class="prose dark:prose-invert">
    <ContentDoc
      v-slot="{ doc }"
      :query="{ locale: locale }"
      path="terms-of-service"
    >
      <AppH1>{{ doc.title }}</AppH1>
      <ContentRenderer :value="doc" />
    </ContentDoc>
  </UContainer>
</template>
