<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const navigationContainer = cva("top-0 z-30 mb-3 bg-gray-50 dark:bg-gray-900", {
  variants: {
    sticky: {
      true: "sticky",
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
        <NuxtLink to="/" active-class="router-logo-active">
          <img src="/logo.svg" class="h-6" />
        </NuxtLink>
      </div>

      <ul class="col-span-4 hidden items-center justify-center gap-3 lg:flex">
        <li>
          <NuxtLink
            to="/calendar"
            class="rounded-lg px-3 py-2 transition-all hover:bg-zinc-200 hover:dark:bg-zinc-700"
          >
            {{ $t("general.releaseCalendar") }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/title"
            class="rounded-lg px-3 py-2 transition-all hover:bg-zinc-200 hover:dark:bg-zinc-700"
          >
            {{ $t("general.browse") }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/profile"
            class="rounded-lg px-3 py-2 transition-all hover:bg-zinc-200 hover:dark:bg-zinc-700"
          >
            {{ $t("general.library") }}
          </NuxtLink>
        </li>
      </ul>

      <div class="flex items-center justify-end gap-3 whitespace-nowrap">
        <TheSearchToggle />
        <AppLanguageSwitcher />
        <TheUser />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.router-link-active {
  @apply bg-zinc-200 font-bold dark:bg-zinc-700;
}
</style>
