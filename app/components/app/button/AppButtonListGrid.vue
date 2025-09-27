<script setup lang="ts">
const view = defineModel<"list" | "grid">();

function toggle() {
  if (view.value === "grid") {
    view.value = "list";
  } else {
    view.value = "grid";
  }
}
</script>

<template>
  <UButtonGroup size="sm" orientation="horizontal">
    <UButton
      icon="i-fluent-grid-20-filled"
      :color="view === 'grid' ? 'primary' : 'neutral'"
      :variant="view === 'grid' ? 'solid' : 'subtle'"
      @click="toggle"
    />
    <UButton
      icon="i-fluent-list-20-filled"
      :color="view === 'list' ? 'primary' : 'neutral'"
      :variant="view === 'list' ? 'solid' : 'subtle'"
      @click="toggle"
    />
  </UButtonGroup>
</template>
