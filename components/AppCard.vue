<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const card = cva(
  "rounded-md h-fit shadow-md bg-gray-200 overflow-hidden relative dark:bg-gray-800",
  {
    variants: {
      intent: {
        primary: "",
        success: "shadow-green-200",
        error: "shadow-red-200",
        caution: "shadow-orange-200",
      },
      hoverable: {
        true: "hover:shadow-lg transition-shadow duration-150 ease-linear",
      },
      clickable: {
        true: "cursor-pointer",
      },
    },
    defaultVariants: {
      intent: "primary",
      hoverable: true,
      clickable: false,
    },
  }
);

type AppCardProps = VariantProps<typeof card>;

defineProps<{
  intent?: AppCardProps["intent"];
  hoverable?: AppCardProps["hoverable"];
  clickable?: AppCardProps["clickable"];
}>();
</script>

<template>
  <div :class="card({ intent, hoverable, clickable })">
    <slot />
  </div>
</template>
