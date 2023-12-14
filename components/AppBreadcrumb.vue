<script setup lang="ts">
type BreadcrumbItem = {
  label: string;
  href?: string;
  active?: boolean;
};

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<template>
  <ol class="flex items-center gap-2">
    <li
      v-for="(item, i) in items"
      :key="item.label"
      class="flex items-center gap-2"
      :class="{
        'text-gray-500 dark:text-gray-400': !item.active,
      }"
    >
      <NuxtLink
        v-if="item.href"
        class="hover:underline"
        :to="item.href"
        color="gray"
        variant="link"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-else>{{ item.label }}</span>
      <UIcon
        v-if="i !== items.length - 1"
        name="i-fluent-chevron-right-24-filled"
      />
    </li>
  </ol>
</template>
