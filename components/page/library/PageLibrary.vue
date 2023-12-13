<template>
  <div class="flex gap-6">
    <aside class="hidden w-48 flex-shrink-0 sm:w-48 lg:block">
      <slot name="aside" />
    </aside>
    <main class="w-full flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>
