<script setup lang="ts">
const route = useRoute();

const sticky = computed(() => route.meta.stickyNav as boolean);
</script>

<template>
  <div>
    <TheNavigation :sticky="sticky" />
    <main class="container mx-auto min-h-[80vh] overflow-x-hidden px-6 pb-6">
      <AppH1 class="mb-6">{{ $t("general.settings") }}</AppH1>
      <div class="flex flex-col gap-6 sm:flex-row">
        <TheSettingNavigation class="sm:w-48" />
        <div class="flex-1">
          <slot />
        </div>
      </div>
    </main>
    <TheFooter />
    <TheSearch />
  </div>
</template>
