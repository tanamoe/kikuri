<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const navigationContainer = cva("top-0 z-30 bg-gray-50 dark:bg-gray-900", {
  variants: {
    sticky: {
      true: "sticky mb-6",
    },
  },
  defaultVariants: {
    sticky: true,
  },
});

type NavigationContainerProps = VariantProps<typeof navigationContainer>;

defineProps<{
  sticky?: NavigationContainerProps["sticky"];
  disabled?: boolean;
}>();
</script>

<template>
  <nav :class="navigationContainer({ sticky })">
    <div
      class="container mx-auto grid grid-cols-2 items-center px-6 py-3 lg:grid-cols-6"
    >
      <div class="flex items-center justify-start gap-3">
        <div class="block lg:hidden">
          <TheNavigationSidebar />
        </div>
        <ULink to="/" class="flex items-center gap-2">
          <img src="/logo.svg" class="h-6" />
          <UBadge variant="soft" size="xs" class="invisible sm:visible">
            Preview
          </UBadge>
        </ULink>
      </div>

      <ul class="col-span-4 hidden items-center justify-center gap-3 lg:flex">
        <li>
          <ULink
            class="navigation"
            active-class="navigation-active"
            to="/calendar"
          >
            {{ $t("general.releaseCalendar") }}
          </ULink>
          <NuxtLink to="/calendar" class=""> </NuxtLink>
        </li>
        <li>
          <ULink
            class="navigation"
            active-class="navigation-active"
            to="/title"
          >
            {{ $t("general.browse") }}
          </ULink>
        </li>
        <li>
          <ULink
            class="navigation"
            active-class="navigation-active"
            to="/profile"
          >
            {{ $t("general.library") }}
          </ULink>
        </li>
      </ul>

      <div class="flex items-center justify-end gap-3 whitespace-nowrap">
        <TheSearchToggle />
        <TheNavigationUser />
      </div>
    </div>
  </nav>
</template>

<style>
.navigation {
  @apply rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-200 dark:text-gray-400 hover:dark:bg-gray-800;
}

.navigation-active {
  @apply bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200;
}
</style>
