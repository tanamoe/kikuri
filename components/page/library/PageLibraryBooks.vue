<script setup lang="ts">
import type { LibraryBookEdit, LibraryBookRemove } from "#build/components";
import type { UserCollectionBooksResponse } from "@/types/collections";

const { $pb } = useNuxtApp();

const props = defineProps<{
  editModal?: InstanceType<typeof LibraryBookEdit>;
  removeModal?: InstanceType<typeof LibraryBookRemove>;
  books: UserCollectionBooksResponse;
  editable: boolean;
}>();

const query = ref("");
const queryDebounced = refDebounced(query, 500);

const rows = computed(() => {
  return props.books.items.map((item) => ({
    id: item.id,
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
    publishDate: item.book!.publishDate,
    quantity: item.quantity,
    price: item.book!.price,
    status: item.status,
    collection: item.collectionId,
  }));
});

function handleEdit(row: (typeof rows.value)[0]) {
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

function handleRemove(row: (typeof rows.value)[0]) {
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

    {{ queryDebounced }}

    <UCard
      v-for="item in rows"
      :key="item.id"
      :ui="{ body: { base: 'flex gap-3 text-sm' } }"
    >
      <div class="w-20 md:w-16 lg:w-14 xl:w-12">
        <img
          v-if="item.cover"
          class="rounded-md"
          :src="item.cover"
          :name="item.name"
        />
      </div>
      <div class="w-full">
        <div v-if="editable" class="float-right">
          <UButton
            v-if="editModal"
            icon="i-fluent-edit-20-filled"
            color="gray"
            variant="ghost"
            square
          />
          <UButton
            v-if="removeModal"
            icon="i-fluent-delete-20-filled"
            color="red"
            variant="ghost"
            square
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
