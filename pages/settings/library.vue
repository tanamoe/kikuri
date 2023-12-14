<script setup lang="ts">
import type { UserCollectionsResponse } from "@/types/collections";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const store = useSettingsStore();

const { data: collections, pending } = await useAsyncData(
  () =>
    $pb.send<UserCollectionsResponse>("/api/user-collections", {
      method: "GET",
      expand: "collection",
    }),
  {
    transform: (collections) =>
      collections.items.map((collection) => ({
        id: collection.collectionId,
        name: collection.collection!.name,
      })),
    default: () => [],
    server: false,
  },
);

const columns = computed(() => [
  {
    id: "cover",
    label: t("general.coverImages"),
  },
  {
    id: "name",
    label: t("general.title"),
  },
  {
    id: "quantity",
    label: t("general.quantity"),
  },
  {
    id: "price",
    label: t("general.price"),
  },
  {
    id: "publishDate",
    label: t("general.publishDate"),
  },
  {
    id: "status",
    label: t("general.status"),
  },
  {
    id: "created",
    label: t("library.created"),
  },
  {
    id: "updated",
    label: t("library.updated"),
  },
  {
    id: "actions",
    label: t("library.actions"),
  },
]);

const selectedCollection = computed(() =>
  collections.value.find(
    (collection) => collection.id === store.library.defaultLibraryId,
  ),
);

definePageMeta({
  layout: "setting",
  middleware: "auth",
});
</script>

<template>
  <form class="space-y-6">
    <UFormGroup
      name="defaultCollection"
      :label="$t('settings.defaultCollection')"
    >
      <USelectMenu
        v-model="store.library.defaultLibraryId"
        :loading="pending"
        :options="collections"
        value-attribute="id"
        option-attribute="name"
      >
        <template #label>
          <span v-if="selectedCollection">{{ selectedCollection.name }}</span>
          <span v-else>
            {{ $t("settings.selectDefaultCollection") }}
          </span>
        </template>
      </USelectMenu>
      <div class="mt-3 text-right">
        <UButton
          v-if="selectedCollection"
          color="gray"
          @click="store.library.defaultLibraryId = undefined"
        >
          {{ $t("general.clear") }}
        </UButton>
      </div>
    </UFormGroup>
    <UFormGroup name="libraryColumns" :label="$t('settings.libraryColumns')">
      <USelectMenu
        v-model="store.library.columns"
        :options="columns"
        value-attribute="id"
        option-attribute="label"
        multiple
      >
        <template #label>
          <span>
            {{
              $t("settings.columns", { count: store.library.columns.length })
            }}
          </span>
        </template>
      </USelectMenu>
    </UFormGroup>
  </form>
</template>
