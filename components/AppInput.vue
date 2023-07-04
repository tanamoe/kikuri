<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const inputField = cva(
  "w-full rounded-xl border-none transition-all invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-primary ",
  {
    variants: {
      background: {
        "100": "bg-zinc-100 dark:bg-zinc-800",
        "200": "bg-zinc-200 dark:bg-zinc-700",
        "300": "bg-zinc-300 dark:bg-zinc-600",
      },
    },
    defaultVariants: {
      background: "200",
    },
  }
);

type AppInputProps = VariantProps<typeof inputField>;

defineProps<{
  background?: AppInputProps["background"];
  modelValue: string;
}>();

defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
}>();
</script>

<template>
  <input
    :class="inputField({ background })"
    :value="modelValue"
    @input="({ target }) => $emit('update:modelValue', (target as HTMLInputElement).value)"
  />
</template>
