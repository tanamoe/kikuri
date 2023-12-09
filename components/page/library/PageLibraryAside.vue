<script setup lang="ts">
import { type UserCollectionsResponse } from "@/types/collections";

const { $pb } = useNuxtApp();
const libraryStatus = useLibraryStatus();

const { data: collections } = await useAsyncData(
  () =>
    $pb.send<UserCollectionsResponse>(
      `/api/user-collections/${$pb.authStore.model?.id}`,
      { method: "GET", expand: "collection" },
    ),
  {
    transform: (collections) =>
      collections.items.map((item) => ({
        label: item.collection?.name || "",
        to: item.collection?.id,
      })),
  },
);

const status = computed(() =>
  libraryStatus.status.value.map((s) => ({
    ...s,
    to: `#${s.id}`,
    external: true,
  })),
);
</script>

<template>
  <div class="space-y-3">
    <template v-if="collections">
      <UVerticalNavigation :links="collections" />

      <UDivider />
    </template>

    <UVerticalNavigation :links="status" />
  </div>
</template>
