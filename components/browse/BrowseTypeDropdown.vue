<script setup lang="ts">
const { t } = useI18n();

const items = computed(() => [
  [
    {
      label: t("general.title"),
      to: "/browse/titles",
    },
    {
      label: t("general.release"),
      to: "/browse/releases",
    },
    {
      label: t("general.publisher"),
      to: "/browse/publishers",
    },
  ],
]);
</script>

<template>
  <UDropdown :items :popper="{ placement: 'bottom-start' }">
    <AppH1
      class="rounded-lg px-2 py-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
    >
      <span class="decoration-primary-400 underline decoration-4">
        <slot />
      </span>
      <UIcon name="i-fluent-chevron-down-20-filled" class="ms-2 h-5 w-5" />
    </AppH1>
  </UDropdown>
</template>
