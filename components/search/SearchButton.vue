<script setup lang="ts">
import { SearchModal } from "#components";

const overlay = useOverlay();
const modal = overlay.create(SearchModal);
</script>

<template>
  <div>
    <UButton
      icon="i-fluent-search-20-filled"
      variant="ghost"
      color="neutral"
      class="flex sm:hidden"
      square
      :aria-label="$t('general.search')"
      @click="
        () => {
          modal.open();
        }
      "
    />
    <UButton
      icon="i-fluent-search-20-filled"
      color="neutral"
      variant="outline"
      class="hidden sm:flex"
      @click="
        () => {
          modal.open();
        }
      "
    >
      {{ $t("general.searchPlaceholder") }}
      <template #trailing>
        <div class="flex items-center gap-0.5">
          <UKbd value="meta" />
          <UKbd value="K" />
        </div>
      </template>
    </UButton>
  </div>
</template>
