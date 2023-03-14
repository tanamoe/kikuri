<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const buttonLink = cva(
  "h-fit overflow-hidden rounded-xl py-2 px-3 inline-block transition-all duration-150 ease-linear",
  {
    variants: {
      intent: {
        primary: ["bg-primary", "hover:bg-primary/75", "text-white"],
        secondary: [
          "bg-zinc-200 dark:bg-zinc-700",
          "hover:bg-zinc-300 dark:hover:bg-zinc-600",
        ],
        success: ["bg-green-200", "hover:bg-green-300"],
        error: ["bg-red-200", "hover:bg-red-300"],
        caution: ["bg-orange-200", "hover:bg-orange-300"],
        none: ["hover:bg-zinc-100 dark:hover:bg-zinc-700"],
      },
    },
    defaultVariants: {
      intent: "none",
    },
    compoundVariants: [
      {
        intent: ["primary", "secondary", "success", "error", "caution"],
        class: "hover:shadow-lg",
      },
    ],
  }
);

type AppButtonLinkProps = VariantProps<typeof buttonLink>;

defineProps<{
  intent?: AppButtonLinkProps["intent"];
  href: string;
}>();
</script>

<template>
  <a
    :href="href"
    :class="buttonLink({ intent })"
    target="_blank"
    rel="noreferrer"
  >
    <div className="flex items-center justify-center gap-3">
      <slot />
    </div>
  </a>
</template>
