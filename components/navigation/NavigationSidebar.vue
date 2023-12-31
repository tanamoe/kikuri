<script setup lang="ts">
defineProps<{
  links: {
    label: string;
    badge?: string;
    to?: string;
  }[];
}>();

const isOpen = ref(false);
</script>

<template>
  <UButton
    icon="i-fluent-line-horizontal-3-20-filled"
    color="gray"
    square
    variant="ghost"
    :aria-label="$t('general.openNavigation')"
    @click="isOpen = true"
  />
  <USlideover v-model="isOpen" side="left">
    <div class="p-6">
      <div class="mb-6 flex items-center justify-between">
        <NuxtLink to="/">
          <img src="/logo.svg" class="h-6" alt="Tana.moe logo" />
        </NuxtLink>

        <UButton
          icon="i-fluent-dismiss-20-filled"
          color="gray"
          square
          variant="ghost"
          :aria-label="$t('general.close')"
          @click="isOpen = false"
        />
      </div>
      <ul class="mt-12 space-y-2 font-lexend text-2xl font-bold">
        <li v-for="link in links" :key="link.label">
          <NuxtLink :to="link.to" class="flex items-center gap-3">
            {{ link.label }}
            <UBadge v-if="link.badge">{{ link.badge }}</UBadge>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </USlideover>
</template>

<style scoped>
/* TODO: might need changes later */
.router-link-active {
  @apply text-tanablue-500;
}
</style>
