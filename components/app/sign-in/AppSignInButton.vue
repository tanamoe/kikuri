<script setup lang="ts">
const ui = {
  base: "gap-2.5 px-3 py-2.5",
};
</script>

<template>
  <UButton color="neutral" block :ui size="md">
    <div class="flex-1 text-center">
      <slot />
    </div>
  </UButton>
</template>
