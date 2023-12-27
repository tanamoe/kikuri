<script setup lang="ts">
const ui = {
  block: "gap-2.5",
  padding: {
    md: "px-3 py-2.5",
  },
  color: {
    gray: {
      solid:
        "ring-0 bg-gray-200 dark:bg-gray-700 hover:bg-gray-200/75 dark:hover:bg-gray-700/50",
    },
  },
  icon: {
    base: "text-[#5865F2]",
  },
};
</script>

<template>
  <UButton color="gray" block :ui="ui" icon="i-simple-icons-discord" size="md">
    <div class="flex-1 text-center">
      {{
        $t("auth.loginWith", {
          name: "Discord",
        })
      }}
    </div>
  </UButton>
</template>
