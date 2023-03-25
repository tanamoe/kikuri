<template>
  <div>
    <TheNavigation position="fixed" />
    <main class="container mx-auto px-3">
      <slot />
    </main>
    <TheSearch />
  </div>
</template>
