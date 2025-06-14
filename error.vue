<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const is404 = computed(() => props.error?.statusCode === 404);
const isDev = import.meta.dev;

const i18nHead = useLocaleHead({
  seo: true,
});

useHead({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang,
  },
  bodyAttrs: {
    class:
      "dark:bg-neutral-900 bg-neutral-50 text-neutral-700 dark:text-neutral-200",
  },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtLayout>
    <div class="flex h-[80vh] items-center justify-center">
      <div class="space-y-6 text-center">
        <h1 class="font-lexend text-8xl font-bold">
          {{ error!.statusCode }}
        </h1>
        <p>
          <span v-if="is404">{{ $t("error.notFoundMessage") }}</span>
          <span v-else-if="error?.message">{{ error.message }}</span>
          <span v-else>{{ $t("error.generalMessage") }}</span>
        </p>
        <div class="flex justify-center gap-3">
          <UButton color="primary" @click="handleError">
            {{ $t("error.returnHome") }}
          </UButton>
        </div>
        <p v-if="isDev">
          {{ error }}
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>
