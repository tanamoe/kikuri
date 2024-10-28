<script setup lang="ts">
import { ModalCollectionBookAddBulk } from "#components";
import type { ReleasesResponse, TitlesResponse } from "@/types/pb";
import { joinURL } from "ufo";
import type { AppBookProps } from "../book/AppBook.vue";

const modal = useModal();
const { t } = useI18n();
const { $pb } = useNuxtApp();

const selected = ref<NonNullable<typeof rows.value> | undefined>(
  $pb.authStore.isAuthRecord ? [] : undefined,
);

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

const columns = [
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
];

const rows = computed(() =>
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
  wrapper: "relative overflow-x-auto [font-feature-settings:'ss01']",
  td: {
    base: "whitespace-normal lg:whitespace-normal",
    color: "text-gray-600 dark:text-gray-300",
  },
};

function handleAddBulk() {
  if (selected.value) {
    modal.open(ModalCollectionBookAddBulk, {
      books: selected.value.map((book) => ({
        id: book.id,
        name: book.name,
      })),
      callback: () => emit("add"),
    });
  }
}
</script>

<template>
  <div class="space-y-3">
    <AppH3 v-if="heading">{{ heading }}</AppH3>
    <div v-if="view === 'list'" class="space-y-3">
      <UTable v-model="selected" :columns :rows :ui>
        <template #volume-data="{ row }">
          <UBadge variant="soft" color="gray">{{ row.volume }}</UBadge>
        </template>
        <template
          #name-data="{ row }: { row: NonNullable<typeof rows.value>[0] }"
        >
          <div class="min-w-52">
            <UBadge
              v-if="row.edition"
              color="tanaamber"
              class="mb-2 bg-opacity-50 text-gray-900 backdrop-blur"
            >
              {{ row.edition }}
            </UBadge>
            <ULink
              v-if="title && release"
              :to="joinURL('/title', title.slug, release.id, row.id)"
              class="hover:underline"
            >
              {{ row.name }}
            </ULink>
            <div v-else>{{ row.name }}</div>
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
          <LibraryAddButton
            :id="row.id"
            :name="row.name"
            :in-collections="row.inCollections"
            square
            color="gray"
            class="justify-end gap-1"
            @add="() => $emit('add')"
          />
        </template>
      </UTable>
      <UButton
        v-if="$pb.authStore.isAuthRecord && selected"
        :label="$t('library.addToLibraryBulk')"
        icon="i-fluent-book-add-20-filled"
        color="gray"
        :disabled="selected.length <= 0"
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
        sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
        @add="() => $emit('add')"
      />
    </div>
  </div>
</template>
