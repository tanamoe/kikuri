<script setup lang="ts">
const { releaseStatus: options } = useOptions();

const model = defineModel<string>();

const current = computed(() => options.value.find((s) => s.id === model.value));
</script>

<template>
  <USelectMenu
    v-model="model"
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
