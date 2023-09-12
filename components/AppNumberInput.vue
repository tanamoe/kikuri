<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [number];
}>();

const n = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <UInput
    v-model="n"
    icon="i-heroicons-magnifying-glass-20-solid"
    :ui="{ icon: { leading: { pointer: '' }, trailing: { pointer: '' } } }"
  >
    <template #leading>
      <UButton
        color="gray"
        variant="link"
        icon="i-fluent-subtract-20-filled"
        :padded="false"
        @click="n--"
      />
    </template>
    <template #trailing>
      <UButton
        color="gray"
        variant="link"
        icon="i-fluent-add-20-filled"
        :padded="false"
        @click="n++"
      />
    </template>
  </UInput>
</template>
