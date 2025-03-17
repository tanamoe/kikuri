<script setup lang="ts">
const route = useRoute();

const sticky = computed(() => route.meta.stickyNav as boolean);
</script>

<template>
  <div>
    <NavigationBar :sticky />

    <main class="min-h-[80vh] pb-6">
      <slot />
    </main>

    <TheFooter />
  </div>
</template>
