<template>
  <div class="flex gap-6">
    <aside class="hidden w-48 flex-shrink-0 lg:block">
      <slot name="aside" />
    </aside>
    <main class="w-full flex-1">
      <slot />
    </main>
  </div>
</template>
