<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const badge = cva(
  "flex items-center rounded-lg py-0.5 px-1.5 text-xs text-zinc-800 w-fit",
  {
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
  }
);

type AppBadgeProps = VariantProps<typeof badge>;

defineProps<{
  intent?: AppBadgeProps["intent"];
}>();
</script>

<template>
  <span :class="badge({ intent })">
    <slot />
  </span>
</template>
