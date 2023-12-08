<template>
  <div class="flex gap-6">
    <aside class="hidden flex-shrink-0 lg:block">
      <slot name="aside" />
    </aside>
    <main>
      <slot />
    </main>
  </div>
</template>
