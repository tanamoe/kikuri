<script setup lang="ts">
import type { UserCollectionBooksResponse } from "@/types/collections";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const libraryPrompt = useLibraryPrompt();
const settingsStore = useSettingsStore();

const props = defineProps<{
  pending: boolean;
  books: UserCollectionBooksResponse;
  editable: boolean;
}>();

const rows = computed(() =>
  props.books.items.map((item) => ({
    id: item.bookId,
    cover: item.book?.covers
      ? $pb.files.getUrl(
          {
            collectionId: item.book!.parentCollection,
            id: item.book!.parentId,
          },
          item.book!.covers[0],
        )
      : undefined,
    name: item.book!.publication.name,
    edition: item.book!.edition,
    digital: item.book!.publication.digital,
    publishDate: {
      value: item.book!.publishDate,
      class: "whitespace-nowrap",
    },
    quantity: item.quantity,
    price: {
      value: item.book!.price,
      class: "whitespace-nowrap",
    },
    status: item.status,
    collection: item.collectionId,
    created: {
      value: item.created,
      class: "whitespace-nowrap",
    },
    updated: {
      value: item.updated,
      class: "whitespace-nowrap",
    },
  })),
);

const columns = computed(() =>
  [
    {
      key: "cover",
      label: t("general.coverImages"),
      class: "whitespace-nowrap",
    },
    {
      key: "name",
      label: t("general.title"),
      sortable: true,
    },
    {
      key: "quantity",
      label: t("general.quantity"),
      class: "whitespace-nowrap",
      sortable: true,
    },
    {
      key: "price",
      label: t("general.price"),
      class: "whitespace-nowrap",
      sortable: true,
    },
    {
      key: "publishDate",
      label: t("general.publishDate"),
      class: "whitespace-nowrap",
      sortable: true,
    },
    {
      key: "status",
      label: t("general.status"),
      class: "whitespace-nowrap",
      sortable: true,
    },
    {
      key: "created",
      label: t("library.created"),
      class: "whitespace-nowrap",
      sortable: true,
    },
    {
      key: "updated",
      label: t("library.updated"),
      class: "whitespace-nowrap",
      sortable: true,
    },
    {
      key: "actions",
      label: t("library.actions"),
      class: "whitespace-nowrap text-right",
    },
  ].filter((col) => settingsStore.library.columns.includes(col.key)),
);
</script>

<template>
  <div class="rounded-md border border-gray-200 dark:border-gray-800">
    <UTable
      :rows="rows || []"
      :columns="columns"
      :loading="pending"
      class="[font-feature-settings:'ss01']"
      :ui="{
        thead: 'bg-gray-200 dark:bg-gray-800',
        tr: {
          base: 'hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors',
        },
        wrapper: 'relative overflow-x-auto',
        td: { base: 'whitespace-nowrap lg:whitespace-normal' },
      }"
    >
      <template #cover-data="{ row }">
        <img
          v-if="row.cover"
          class="aspect-[2/3] h-full max-h-16 rounded-md object-cover"
          :src="row.cover"
        />
      </template>

      <template #name-data="{ row }">
        <div
          v-if="row.edition || row.digital"
          class="mb-2 flex items-center gap-3 whitespace-nowrap"
        >
          <UBadge v-if="row.edition" color="tanaamber">
            {{ row.edition }}
          </UBadge>
          <UBadge v-if="row.digital" color="red">Digital</UBadge>
        </div>
        <div class="flex items-center gap-3">
          <div>{{ row.name }}</div>
        </div>
      </template>

      <template #quantity-data="{ row }">
        <span>{{ row.quantity }}</span>
      </template>

      <template #price-data="{ row }">
        <span>{{ $n(row.price.value, "currency", "vi") }}</span>
      </template>

      <template #publishDate-data="{ row }">
        <span v-if="row.publishDate.value">
          {{ $d(new Date(row.publishDate.value), "publishDate") }}
        </span>
        <span v-else></span>
      </template>

      <template #created-data="{ row }">
        <span v-if="row.created.value">
          {{ $d(new Date(row.created.value), "publishDate") }}
        </span>
        <span v-else></span>
      </template>

      <template #updated-data="{ row }">
        <span v-if="row.updated.value">
          {{ $d(new Date(row.updated.value), "publishDate") }}
        </span>
        <span v-else></span>
      </template>

      <template #status-data="{ row }">
        <span>{{ $t(`status.${row.status.toLowerCase()}`) }}</span>
      </template>

      <template #actions-data="{ row }">
        <div v-if="editable" class="whitespace-nowrap text-right">
          <UButton
            icon="i-fluent-edit-20-filled"
            color="gray"
            variant="ghost"
            square
            @click="libraryPrompt.edit(row)"
          />
          <UButton
            icon="i-fluent-delete-20-filled"
            color="red"
            variant="ghost"
            square
            @click="libraryPrompt.remove(row)"
          />
        </div>
        <div v-else></div>
      </template>
    </UTable>
  </div>
</template>
