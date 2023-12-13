<script setup lang="ts">
const { isAuthenticated } = useAuthentication();

defineProps<{
  links: {
    authenticated?: boolean;
    icon?: string;
    label: string;
    to: string;
  }[][];
}>();
</script>

<template>
  <div class="flex gap-3 overflow-x-scroll whitespace-nowrap sm:flex-col">
    <div v-for="(group, i) in links" :key="i" class="flex gap-1 sm:flex-col">
      <template v-for="link in group" :key="link.to">
        <UButton
          v-if="
            link.authenticated ? link.authenticated == isAuthenticated : true
          "
          active-class="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-100"
          :to="link.to"
          :icon="link.icon"
          color="gray"
          variant="ghost"
        >
          {{ link.label }}
        </UButton>
      </template>
    </div>
  </div>
</template>
