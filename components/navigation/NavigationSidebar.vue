<script setup lang="ts">
import type { UserCollectionsResponse } from "@/types/collections";

const { $pb } = useNuxtApp();
const settingsStore = useSettingsStore();
const { isAuthenticated } = useAuthentication();

const { data: collections } = await useLazyAsyncData(() =>
  $pb.send<UserCollectionsResponse>("/api/user-collections", {
    method: "GET",
    expand: "collection",
  }),
);

const isOpen = ref(false);

const firstCollection = computed(() => {
  if (!isAuthenticated.value) {
    return "/login";
  }

  if (settingsStore.library.defaultLibraryId) {
    return `/library/${settingsStore.library.defaultLibraryId}`;
  } else if (collections.value?.items[0]?.collectionId) {
    return `/library/${collections.value.items[0].collectionId}`;
  }
});
</script>

<template>
  <UButton
    icon="i-fluent-line-horizontal-3-20-filled"
    color="gray"
    square
    variant="ghost"
    :aria-label="$t('general.openNavigation')"
    @click="isOpen = true"
  />
  <USlideover v-model="isOpen" side="left">
    <div class="p-6">
      <div class="mb-6 flex items-center justify-between">
        <NuxtLink to="/">
          <img src="/logo.svg" class="h-6" alt="Tana.moe logo" />
        </NuxtLink>

        <UButton
          icon="i-fluent-dismiss-20-filled"
          color="gray"
          square
          variant="ghost"
          :aria-label="$t('general.close')"
          @click="isOpen = false"
        />
      </div>
      <ul class="mt-12 space-y-2 font-lexend text-2xl font-bold">
        <li>
          <NuxtLink to="/calendar">
            {{ $t("general.releaseCalendar") }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/browse">
            {{ $t("general.browse") }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="firstCollection" class="flex items-center gap-3">
            {{ $t("general.library") }}
            <UBadge>{{ $t("general.new") }}</UBadge>
          </NuxtLink>
        </li>
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
