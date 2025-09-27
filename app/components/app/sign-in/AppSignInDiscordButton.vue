<script setup lang="ts">
const ui = {
  base: "gap-2.5 px-3 py-2.5",
};
</script>

<template>
  <UButton color="neutral" block :ui icon="i-simple-icons-discord" size="md">
    <div class="flex-1 text-center">
      {{
        $t("auth.loginWith", {
          name: "Discord",
        })
      }}
    </div>
  </UButton>
</template>
