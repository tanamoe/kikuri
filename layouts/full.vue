<script setup lang="ts">
const route = useRoute();

const sticky = computed(() => route.meta.stickyNav as boolean);
</script>

<template>
  <div>
    <TheNavigation :sticky="sticky" />
    <main class="pb-6">
      <slot />
    </main>
    <TheFooter />
    <TheSearch />
  </div>
</template>
