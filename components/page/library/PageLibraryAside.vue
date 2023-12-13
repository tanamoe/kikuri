<script setup lang="ts">
import { type UserCollectionsResponse } from "@/types/collections";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const { data: collections } = await useAsyncData(
  () =>
    $pb.send<UserCollectionsResponse>(`/api/user-collections`, {
      method: "GET",
      expand: "collection",
    }),
  {
    transform: (collections) =>
      collections.items.map((item) => ({
        label: item.collection!.name,
        to: item.collection!.id,
      })),
  },
);

const links = computed(() => {
  const l = [];

  if (collections.value) l.push(collections.value);

  l.push([
    {
      icon: "i-fluent-collections-20-filled",
      label: t("library.createCollection"),
      to: "/library/create",
    },
  ]);

  return l;
});
</script>

<template>
  <AppSideNavigation :links="links" />
</template>
