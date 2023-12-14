<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: number;
  }>(),
  {
    modelValue: 0,
  },
);

const emit = defineEmits<{
  "update:modelValue": [number | undefined];
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
    type="number"
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
