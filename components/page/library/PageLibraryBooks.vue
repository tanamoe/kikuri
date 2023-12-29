<script setup lang="ts">
import MiniSearch from "minisearch";
import type { LibraryBookEdit, LibraryBookRemove } from "#build/components";
import type { CollectionBooksStatusOptions } from "@/types/pb";

type Book = {
  id: string;
  cover: string | undefined;
  name: string;
  edition: string | undefined;
  digital: boolean | undefined;
  publishDate: string | undefined;
  quantity: number;
  price: number | undefined;
  status: CollectionBooksStatusOptions;
  collection: string;
};

const props = defineProps<{
  editModal?: InstanceType<typeof LibraryBookEdit>;
  removeModal?: InstanceType<typeof LibraryBookRemove>;
  books: Book[];
  editable: boolean;
}>();

const miniSearch = new MiniSearch({
  fields: ["normalizedName"],
  searchOptions: {
    fuzzy: 0.1,
    prefix: true,
  },
});

miniSearch.addAll(
  props.books.map(({ id, name }) => ({
    id,
    name,
    normalizedName: normalize(name),
  })),
);

const query = ref("");
const queryDebounced = refDebounced(query, 500);

const results = computed(() => {
  if (queryDebounced.value === "") {
    return props.books;
  }

  const results = miniSearch.search(normalize(queryDebounced.value));

  return props.books.filter((item) =>
    results.some((result) => result.id === item.id),
  );
});

const ui = {
  body: { base: "flex gap-3 text-sm hover:shadow-lg transition-shadow" },
};

function handleEdit(row: Book) {
  if (props.editModal) {
    props.editModal.open(
      {
        id: row.id,
        name: row.name,
      },
      {
        collection: row.collection,
        quantity: row.quantity,
        status: row.status,
      },
    );
  }
}

function handleRemove(row: Book) {
  if (props.removeModal) {
    props.removeModal.open(
      {
        id: row.id,
        name: row.name,
      },
      {
        collection: row.collection,
      },
    );
  }
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <UInput v-model="query" :placeholder="$t('general.search')" />

    <UCard v-for="item in results" :key="item.id" :ui="ui">
      <div class="w-20 md:w-16 lg:w-14 xl:w-12">
        <img
          v-if="item.cover"
          class="rounded-md"
          :src="item.cover"
          :name="item.name"
        />
        <div
          v-else
          class="aspect-[2/3] h-auto w-full rounded-md bg-gray-200 object-cover dark:bg-gray-800"
        />
      </div>
      <div class="w-full">
        <div v-if="editable" class="float-right flex gap-1">
          <UButton
            v-if="editModal"
            icon="i-fluent-edit-20-filled"
            color="gray"
            variant="ghost"
            square
            @click="handleEdit(item)"
          />
          <UButton
            v-if="removeModal"
            icon="i-fluent-delete-20-filled"
            color="red"
            variant="ghost"
            square
            @click="handleRemove(item)"
          />
        </div>

        <div class="space-y-2">
          <div v-if="item.edition || item.digital">
            <UBadge v-if="item.edition" color="tanaamber">
              {{ item.edition }}
            </UBadge>
            <UBadge v-if="item.digital" color="red"> Digital </UBadge>
          </div>
          <h3 class="font-bold">
            {{ item.name }}
          </h3>
          <div v-if="item.publishDate" class="text-gray-600 dark:text-gray-400">
            Phát hành {{ $d(new Date(item.publishDate), "publishDate") }}
          </div>
          <div class="flex gap-2 text-gray-600 dark:text-gray-400">
            <div>
              {{ $t(`status.${item.status.toLowerCase()}`) }}
            </div>
            &middot;
            <div>
              <span v-if="item.price">
                {{ $n(item.price, "currency", "vi") }}
              </span>
              &times;
              {{ item.quantity }}
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
