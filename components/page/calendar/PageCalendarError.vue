<script setup lang="ts">
defineProps<{
  error: Error;
}>();
</script>

<template>
  <UContainer class="my-12 flex items-center justify-center">
    <div class="text-center">
      <p>{{ "~(>_<~)" }}</p>
      <h1 class="my-3 font-lexend text-4xl font-black">
        {{ error.name }}
      </h1>
      <p>{{ error.message }}</p>
    </div>
  </UContainer>
</template>
