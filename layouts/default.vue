<script setup lang="ts">
const route = useRoute();

const sticky = computed(() => route.meta.stickyNav as boolean);
</script>

<template>
  <div>
    <NavigationBar :sticky="sticky" />
    <main class="container mx-auto pb-6">
      <slot />
    </main>
    <TheFooter />
    <SearchBar />
  </div>
</template>
