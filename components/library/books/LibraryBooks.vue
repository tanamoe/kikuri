<script setup lang="ts">
import type { CollectionBookResponse } from "@/types/api/collections";
import type { TableColumn } from "@nuxt/ui";
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

const columns = computed<TableColumn<(typeof rows.value)[0]>[]>(() => [
  {
    accessorKey: "volume",
    header: t("general.volume"),
  },
  {
    accessorKey: "name",
    header: t("general.name"),
  },
  {
    accessorKey: "status",
    header: t("general.status"),
  },
  {
    accessorKey: "quantity",
    header: t("general.quantity"),
  },
  {
    accessorKey: "publishDate",
    header: t("general.publishDate"),
    sortable: true,
  },
  {
    accessorKey: "price",
    header: t("general.price"),
  },
  {
    accessorKey: "actions",
    header: "",
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
  root: "relative overflow-x-auto [font-feature-settings:'ss01']",
  td: "whitespace-normal lg:whitespace-normal text-neutral-600 dark:text-neutral-300",
};
</script>

<template>
  <div v-if="view === 'table'" class="space-y-3">
    <UTable :columns :data="rows" :ui>
      <template #volume-cell="{ row }">
        <UBadge variant="soft" color="neutral">{{
          row.original.volume
        }}</UBadge>
      </template>
      <template #name-cell="{ row }">
        <div class="flex min-w-52 items-center gap-3">
          <ULink
            v-if="row.original.release && row.original.title"
            :to="
              joinURL(
                '/title',
                row.original.title.slug,
                row.original.release.id,
                row.id!,
              )
            "
            class="hover:underline"
          >
            {{ row.original.name }}
          </ULink>
          <span v-else>{{ row.original.name }}</span>
          <UBadge
            v-if="row.original.edition"
            color="secondary"
            class="w-fit text-neutral-900"
          >
            {{ row.original.edition }}
          </UBadge>
        </div>
      </template>
      <template #publishDate-cell="{ row }">
        <span v-if="row.original.publishDate">
          {{ $d(new Date(row.original.publishDate), "publishDate") }}
        </span>
      </template>
      <template #price-cell="{ row }">
        <span>
          {{ $n(row.original.price, "currency", "vi") }}
        </span>
      </template>
      <template #actions-cell="{ row }">
        <div class="flex gap-1">
          <LibraryEditButton
            :id="row.id"
            :name="row.original.publication?.name ?? $t('general.tba')"
            :collection="row.original.collectionId"
            :quantity="row.original.quantity"
            :status="row.original.status"
            variant="subtle"
            color="neutral"
            @change="$emit('change')"
          />
          <LibraryRemoveButton
            :id="row.id"
            :name="row.original.publication?.name ?? $t('general.tba')"
            :collection="row.original.collectionId"
            color="neutral"
            variant="subtle"
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
