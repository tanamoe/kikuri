<script setup lang="ts">
const route = useRoute();

const sticky = computed(() => route.meta.stickyNav as boolean);
</script>

<template>
  <div>
    <NavigationBar :sticky />

    <UContainer class="min-h-[80vh]" as="main">
      <slot />
    </UContainer>

    <TheFooter />
  </div>
</template>
