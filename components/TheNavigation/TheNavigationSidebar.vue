<script setup lang="ts">
const isOpen = ref(false);
</script>

<template>
  <UButton
    icon="i-fluent-line-horizontal-3-20-filled"
    color="gray"
    square
    variant="ghost"
    @click="isOpen = true"
  />
  <USlideover v-model="isOpen" side="left">
    <div class="p-6">
      <div class="mb-6 flex items-center justify-between">
        <NuxtLink to="/">
          <img src="/logo.svg" class="h-6" />
        </NuxtLink>

        <UButton
          icon="i-fluent-dismiss-20-filled"
          color="gray"
          square
          variant="ghost"
          @click="isOpen = false"
        />
      </div>
      <ul class="mt-12 space-y-2 font-lexend text-2xl font-bold">
        <li>
          <NuxtLink to="/calendar">
            {{ $t("general.releaseCalendar") }}
          </NuxtLink>
        </li>
        <li>{{ $t("general.browse") }}</li>
        <li>{{ $t("general.library") }}</li>
      </ul>
    </div>
  </USlideover>
</template>

<style scoped>
/* TODO: might need changes later */
.router-link-active {
  @apply text-tanablue-500;
}
</style>
