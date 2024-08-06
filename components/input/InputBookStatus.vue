<script setup lang="ts">
const { collectionBookStatus: options } = useOptions();

const status = defineModel<string>();

const current = computed(() =>
  options.value.find((s) => s.id === status.value),
);
</script>

<template>
  <USelectMenu
    v-model="status"
    :options
    value-attribute="id"
    option-attribute="label"
  >
    <template #label>
      <span v-if="current">
        {{ current.label }}
      </span>
      <span v-else>
        {{ $t("general.statusSelect") }}
      </span>
    </template>
  </USelectMenu>
</template>
