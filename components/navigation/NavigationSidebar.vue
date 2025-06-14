<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const open = ref(false);

function close() {
  open.value = false;
}

defineProps<{
  items: NavigationMenuItem[];
}>();

const ui = {
  content: "divide-none",
  header: "px-6 py-6 sm:px-6 pb-4",
  body: "p-4 sm:p-6",
};
</script>

<template>
  <USlideover v-model:open="open" side="left" :ui>
    <UButton
      icon="i-fluent-line-horizontal-3-20-filled"
      color="neutral"
      square
      variant="ghost"
      :aria-label="$t('general.openNavigation')"
    />

    <template #header>
      <div class="flex items-center justify-between">
        <NuxtLink to="/">
          <img src="/logo.svg" class="h-6" alt="Tana.moe logo" />
        </NuxtLink>

        <UButton
          icon="i-fluent-dismiss-20-filled"
          color="neutral"
          variant="ghost"
          square
          :aria-label="$t('general.close')"
          @click="close"
        />
      </div>
    </template>

    <template #body>
      <UNavigationMenu :items orientation="vertical" />
    </template>
  </USlideover>
</template>
