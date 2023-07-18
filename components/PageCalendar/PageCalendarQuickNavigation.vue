<script setup lang="ts">
const floatingButton = {
  color: {
    gray: {
      solid:
        "shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:disabled:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
    },
  },
};

const props = defineProps<{
  modelValue: number;
  length: number;
}>();
const emit = defineEmits<{
  "update:modelValue": [number];
}>();

const scrollUp = () =>
  props.modelValue > 0 && emit("update:modelValue", props.modelValue - 1);
const scrollDown = () =>
  props.modelValue < props.length &&
  emit("update:modelValue", props.modelValue + 1);
const scrollToTop = () => emit("update:modelValue", 0);
</script>

<template>
  <div
    class="fixed bottom-3 left-1/2 flex w-max -translate-x-1/2 transform space-x-3"
  >
    <UButton
      color="gray"
      icon="i-fluent-chevron-up-20-filled"
      :disabled="modelValue === 0"
      square
      :ui="floatingButton"
      @click="scrollUp"
    />
    <UButton
      icon="i-fluent-arrow-up-20-filled"
      color="gray"
      :trailing="true"
      :ui="floatingButton"
      @click="scrollToTop"
    >
      {{ $t("general.jumpToTop") }}
    </UButton>
    <UButton
      color="gray"
      icon="i-fluent-chevron-down-20-filled"
      :disabled="modelValue === length - 1"
      square
      :ui="floatingButton"
      @click="scrollDown"
    />
  </div>
</template>
