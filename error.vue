<script setup lang="ts">
const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  error: Object,
});

const is404 = computed(() => props.error!.statusCode === 404);
const isDev = process.dev;

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
          <UButton color="black" @click="handleError">
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
