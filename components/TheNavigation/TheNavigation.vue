<script setup lang="ts">
// TODO: remove "kikuri" name placeholder with logo,
// add hover animations and properly place links
const sidebarOpen = ref(false);
</script>

<template>
  <nav
    class="sticky top-0 z-30 mb-3 bg-zinc-100/90 backdrop-blur-lg dark:bg-zinc-800/90"
  >
    <div
      class="container mx-auto grid grid-cols-2 items-center px-6 py-3 lg:grid-cols-6"
    >
      <div class="flex items-center justify-start gap-3">
        <div class="block lg:hidden">
          <TheNavigationSidebar
            :is-open="sidebarOpen"
            :set-is-open="(state: boolean) => (sidebarOpen = state)"
          />
        </div>
        <NuxtLink to="/" active-class="router-logo-active">
          <img src="/logo.svg" class="h-6" />
        </NuxtLink>
      </div>

      <ul class="col-span-4 hidden items-center justify-center gap-3 lg:flex">
        <li>
          <NuxtLink
            to="/"
            class="rounded-lg px-3 py-2 transition-all hover:bg-zinc-200 hover:dark:bg-zinc-700"
            >Lịch phát hành</NuxtLink
          >
        </li>
        <li>
          <NuxtLink
            to="/title"
            class="rounded-lg px-3 py-2 transition-all hover:bg-zinc-200 hover:dark:bg-zinc-700"
            >Danh mục</NuxtLink
          >
        </li>
        <li>
          <NuxtLink
            to="/profile"
            class="rounded-lg px-3 py-2 transition-all hover:bg-zinc-200 hover:dark:bg-zinc-700"
            >Tủ truyện</NuxtLink
          >
        </li>
      </ul>

      <div class="flex items-center justify-end gap-6 whitespace-nowrap">
        <TheSearchToggle />
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
