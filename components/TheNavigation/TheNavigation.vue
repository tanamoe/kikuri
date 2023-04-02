<script setup lang="ts">
// TODO: remove "kikuri" name placeholder with logo,
// add hover animations and properly place links
import { cva, type VariantProps } from "class-variance-authority";

const sidebarOpen = ref(false);

const navigation = cva(
  "top-0 z-30 mb-3 bg-zinc-100/90 backdrop-blur-lg dark:bg-zinc-800/90",
  {
    variants: {
      position: {
        sticky: "sticky",
        fixed: "fixed w-full",
      },
    },
    defaultVariants: {
      position: "sticky",
    },
  }
);

type AppCoverProps = VariantProps<typeof navigation>;

defineProps<{
  position?: AppCoverProps["position"];
}>();
</script>

<template>
  <nav :class="navigation({ position })">
    <div class="container mx-auto flex items-center justify-between px-6 py-3">
      <div class="flex items-center justify-center gap-3">
        <div class="block lg:hidden">
          <TheNavigationSidebar
            :is-open="sidebarOpen"
            :set-is-open="(state: boolean) => (sidebarOpen = state)"
          />
        </div>
        <NuxtLink to="/">kikuri</NuxtLink>
      </div>
      <div class="flex items-center justify-center gap-6">
        <ul class="hidden items-center justify-center gap-6 md:flex">
          <li><NuxtLink to="/">Lịch phát hành</NuxtLink></li>
          <li>Danh mục</li>
          <li>Tủ truyện</li>
        </ul>
        <TheSearchToggle />
        <TheUser />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.router-link-active {
  @apply font-bold;
}
</style>
