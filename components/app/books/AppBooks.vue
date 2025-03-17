<script setup lang="ts">
import { ModalCollectionBookAddBulk } from "#components";
import type {
  AssetsResponse,
  ReleasesResponse,
  TitlesResponse,
} from "@/types/pb";
import { joinURL } from "ufo";
import type { AppBookProps } from "../AppBook.vue";
import type { TableColumn } from "@nuxt/ui";
import type { MetadataImages, MetadataLibrary } from "@/types/common";

type Book = Pick<
  AppBookProps["book"],
  "id" | "edition" | "publishDate" | "price"
> & {
  name: string;
  volume: number;
  inCollections: MetadataLibrary["inCollections"];
  assets?: AssetsResponse<MetadataImages>[];
};

const overlay = useOverlay();
const modal = overlay.create(ModalCollectionBookAddBulk);
const { t } = useI18n();
const { $pb } = useNuxtApp();

const selected = ref<Record<string, boolean>>({});

const props = defineProps<{
  heading?: string;
  books: AppBookProps["book"][];
  release: ReleasesResponse;
  title: TitlesResponse;
  view?: "list" | "grid";
}>();

const emit = defineEmits<{
  add: [];
}>();

const columns = computed<TableColumn<Book>[]>(() => [
  {
    accessorKey: "volume",
    header: t("general.volume"),
  },
  {
    accessorKey: "name",
    header: t("general.name"),
  },
  {
    accessorKey: "publishDate",
    header: t("general.publishDate"),
  },
  {
    accessorKey: "price",
    header: t("general.price"),
  },
  {
    accessorKey: "actions",
  },
]);

const rows = computed<Book[]>(() =>
  props.books.map((book) => ({
    id: book.id,
    volume: book.expand?.publication?.volume
      ? parseVolume(book.expand?.publication.volume)
      : 0,
    name: book.expand?.publication.name ?? book.id,
    edition: book.edition,
    publishDate: book.publishDate,
    price: book.price,
    inCollections: book.metadata?.inCollections,
    assets: book.expand?.assets_via_book,
  })),
);

const ui = {
  root: "relative overflow-x-auto [font-feature-settings:'ss01']",
  td: "whitespace-normal lg:whitespace-normal text-neutral-600 dark:text-neutral-300",
};

function handleAddBulk() {
  if (selected.value) {
    modal.open({
      books: rows.value
        .filter((_, i) => i in selected.value)
        .map(({ id, name }) => ({ id, name })),
      callback: () => emit("add"),
    });
  }
}
</script>

<template>
  <div class="space-y-3">
    <AppH2 v-if="heading">{{ heading }}</AppH2>
    <div v-if="view === 'list'" class="space-y-3">
      <UTable v-model:row-selection="selected" :columns :data="rows" :ui>
        <template #volume-data="{ row }">
          <UBadge variant="soft" color="neutral">{{
            row.original.volume
          }}</UBadge>
        </template>
        <template #name-data="{ row }">
          <div class="flex min-w-52 items-center gap-3">
            <ULink
              v-if="title && release"
              :to="joinURL('/title', title.slug, release.id, row.id)"
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
        <template #publishDate-data="{ row }">
          <span v-if="row.original.publishDate">
            {{ $d(new Date(row.original.publishDate), "publishDate") }}
          </span>
        </template>
        <template #price-data="{ row }">
          <span>
            {{ $n(row.original.price, "currency", "vi") }}
          </span>
        </template>
        <template #actions-data="{ row }">
          <LibraryAddButton
            :id="row.original.id"
            :name="row.original.name"
            :in-collections="row.original.inCollections"
            square
            color="neutral"
            class="justify-end gap-1"
            @add="() => $emit('add')"
          />
        </template>
      </UTable>
      <UButton
        v-if="$pb.authStore.record && selected"
        :label="$t('library.addToLibraryBulk')"
        icon="i-fluent-book-add-20-filled"
        color="neutral"
        @click="handleAddBulk()"
      />
    </div>

    <div v-else class="grid grid-cols-2 gap-6 sm:grid-cols-4 xl:grid-cols-6">
      <AppBook
        v-for="book in books"
        :key="book.id"
        :book
        :publication="book.expand?.publication"
        :release
        :title
        sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, (max-width: 1280px) 15vw, 10vw"
        @add="() => $emit('add')"
      />
    </div>
  </div>
</template>
