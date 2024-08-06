<script setup lang="ts">
const { collectionVisibility: options } = useOptions();

const visibility = defineModel<string>();

const current = computed(() =>
  options.value.find((s) => s.id === visibility.value),
);
</script>

<template>
  <USelectMenu
    v-model="visibility"
    :options
    value-attribute="id"
    option-attribute="label"
  >
    <template #leading>
      <UIcon v-if="current?.icon" :name="current.icon" class="mx-0.5 h-4 w-4" />
      <UIcon v-else name="i-fluent-shield-20-filled" class="mx-0.5 h-4 w-4" />
    </template>
    <template #label>
      <span v-if="current">
        {{ current.label }}
      </span>
      <span v-else>{{ $t("library.selectVisibility") }}</span>
    </template>
  </USelectMenu>
</template>
