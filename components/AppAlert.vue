<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const alert = cva("rounded-lg px-6 py-4 text-zinc-800 w-full", {
  variants: {
    intent: {
      primary: "bg-zinc-200",
      success: "bg-green-200",
      error: "bg-red-200",
      caution: "bg-orange-200",
      info: "bg-amber-200",
      none: "",
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

type AppAlertProps = VariantProps<typeof alert>;

defineProps<{
  intent?: AppAlertProps["intent"];
}>();
</script>

<template>
  <div :class="alert({ intent })">
    <slot />
  </div>
</template>
