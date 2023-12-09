<script setup lang="ts">
import type { UserCollectionBooksResponse } from "@/types/collections";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const libraryPrompt = useLibraryPrompt();

const props = defineProps<{
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
  })),
);

const columns = computed(() => [
  {
    key: "cover",
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
    key: "actions",
  },
]);
</script>

<template>
  <UTable
    :rows="rows || []"
    :columns="columns"
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
      <div class="flex items-center gap-3">
        <div>{{ row.name }}</div>
        <UBadge v-if="row.edition" color="tanaamber">
          {{ row.edition }}
        </UBadge>
      </div>
    </template>

    <template #quantity-data="{ row }">
      <span>{{ row.quantity }}</span>
    </template>

    <template #price-data="{ row }">
      <span>{{ $n(row.price.value, "currency", "vi") }}</span>
    </template>

    <template #publishDate-data="{ row }">
      <span>{{ $d(new Date(row.publishDate.value), "publishDate") }}</span>
    </template>

    <template #status-data="{ row }">
      <span>{{ $t(`status.${row.status.toLowerCase()}`) }}</span>
    </template>

    <template #actions-data="{ row }">
      <div v-if="editable" class="text-right">
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
          disabled
        />
      </div>
      <div v-else></div>
    </template>
  </UTable>
</template>
