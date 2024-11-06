<script setup lang="ts">
import type { CollectionBookResponse } from "@/types/api/collections";
import { joinURL } from "ufo";

export type LibraryBooksView = "list" | "grid" | "table";

interface Props {
  books: CollectionBookResponse[];
  editable: boolean;
  view?: LibraryBooksView;
}

const { t } = useI18n();

const props = withDefaults(defineProps<Props>(), {
  view: "list",
  group: "none",
});

defineEmits<{
  change: [];
}>();

const columns = computed(() => [
  {
    key: "volume",
    label: t("general.volume"),
    sortable: true,
  },
  {
    key: "name",
    label: t("general.name"),
  },
  {
    key: "status",
    label: t("general.status"),
  },
  {
    key: "quantity",
    label: t("general.quantity"),
  },
  {
    key: "publishDate",
    label: t("general.publishDate"),
    sortable: true,
  },
  {
    key: "price",
    label: t("general.price"),
  },
  {
    key: "actions",
  },
]);

const rows = computed(() =>
  props.books.map(({ book, collectionId, quantity, status }) => ({
    id: book!.id,
    collectionId,
    quantity,
    status,
    publication: book!.publication,
    release: book!.publication?.release,
    title: book!.publication?.release?.title,
    volume: book!.publication?.volume
      ? parseVolume(book!.publication.volume)
      : 0,
    name: book!.publication?.name ?? book?.id,
    edition: book!.edition,
    publishDate: book!.publishDate,
    price: book!.price,
  })),
);

const ui = {
  wrapper: "relative overflow-x-auto [font-feature-settings:'ss01']",
  td: {
    base: "whitespace-normal lg:whitespace-normal",
    color: "text-gray-600 dark:text-gray-300",
  },
};
</script>

<template>
  <div v-if="view === 'table'" class="space-y-3">
    <UTable :columns :rows :ui>
      <template #volume-data="{ row }">
        <UBadge variant="soft" color="gray">{{ row.volume }}</UBadge>
      </template>
      <template
        #name-data="{ row }: { row: NonNullable<typeof rows.value>[0] }"
      >
        <div class="flex min-w-52 items-center gap-3">
          <ULink
            v-if="row.release && row.title"
            :to="joinURL('/title', row.title.slug, row.release.id, row.id!)"
            class="hover:underline"
          >
            {{ row.name }}
          </ULink>
          <span v-else>{{ row.name }}</span>
          <UBadge
            v-if="row.edition"
            color="tanaamber"
            class="w-fit text-gray-900"
          >
            {{ row.edition }}
          </UBadge>
        </div>
      </template>
      <template #publishDate-data="{ row }">
        <span v-if="row.publishDate">
          {{ $d(new Date(row.publishDate), "publishDate") }}
        </span>
      </template>
      <template #price-data="{ row }">
        <span>
          {{ $n(row.price, "currency", "vi") }}
        </span>
      </template>
      <template
        #actions-data="{ row }: { row: NonNullable<typeof rows.value>[0] }"
      >
        <div class="flex gap-1">
          <LibraryEditButton
            :id="row.id"
            :name="row.publication?.name ?? $t('general.tba')"
            :collection="row.collectionId"
            :quantity="row.quantity"
            :status="row.status"
            color="gray"
            @change="$emit('change')"
          />
          <LibraryRemoveButton
            :id="row.id"
            :name="row.publication?.name ?? $t('general.tba')"
            :collection="row.collectionId"
            color="gray"
            square
            @change="$emit('change')"
          />
        </div>
      </template>
    </UTable>
  </div>

  <div
    v-else
    class="grid gap-6"
    :class="{
      'grid-cols-2 sm:grid-cols-4 xl:grid-cols-6': view === 'grid',
      'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3': view === 'list',
    }"
  >
    <template v-for="item in books" :key="item.id">
      <LibraryBook
        v-if="item && item.book?.publication?.release?.title"
        :item
        :publication="item.book.publication"
        :release="item.book.publication.release"
        :title="item.book.publication.release.title"
        :editable
        :wide="view === 'list'"
        sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, (max-width: 1280px) 15vw, 10vw"
        @change="() => $emit('change')"
      />
    </template>
  </div>
</template>
