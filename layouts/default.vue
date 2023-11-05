<script setup lang="ts">
const route = useRoute();

const sticky = computed(() => route.meta.stickyNav as boolean);
</script>

<template>
  <div>
    <NavigationBar :sticky="sticky" />

    <UContainer>
      <slot />
    </UContainer>

    <TheFooter />
    <SearchBar />
  </div>
</template>
