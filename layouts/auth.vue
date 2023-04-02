<template>
  <div>
    <TheNavigation position="fixed" />
    <main class="container mx-auto px-6">
      <slot />
    </main>
    <TheSearch />
  </div>
</template>
