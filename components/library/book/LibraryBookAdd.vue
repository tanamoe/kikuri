<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import type {
  UserCollectionsResponse,
  UserCollectionBookResponse,
} from "@/types/collections";
import { CollectionBooksStatusOptions } from "@/types/pb";

const { $pb } = useNuxtApp();
const { pending, update } = useLibraryBook();
const { collectionBookStatus } = useOptions();
const { isAuthenticated, currentUser } = useAuthentication();
const { open: createOpen } = useLibraryCollectionCreate();
const settingsStore = useSettingsStore();

const emit = defineEmits<{
  update: [UserCollectionBookResponse];
}>();

defineExpose({
  open,
  close,
});

const isOpen = ref(false);
const inCollections = ref<string[]>([]);

const { data: collections } = await useLazyAsyncData(
  () =>
    $pb.send<UserCollectionsResponse>(
      `/api/user-collections/${currentUser.value?.id}`,
      {
        method: "GET",
        expand: "collection",
      },
    ),
  {
    transform: (collections) =>
      collections.items.map((collection) => ({
        id: collection.collectionId,
        label: collection.collection?.name,
        disabled: inCollections.value.includes(collection.collectionId),
      })),
    watch: [currentUser, inCollections, isOpen],
  },
);

const schema = z.object({
  collection: z.string(),
  quantity: z.coerce.number().min(0),
  status: z.nativeEnum(CollectionBooksStatusOptions),
});
type Schema = z.output<typeof schema>;

const book = ref<{
  id?: string;
  name?: string;
}>({});
const state = ref<Partial<Schema>>({
  collection: settingsStore.library.defaultLibraryId,
  quantity: 1,
  status: CollectionBooksStatusOptions.COMPLETED,
});

const currentCollection = computed(
  () =>
    collections.value?.find(
      (collection) => collection.id === state.value.collection,
    ),
);
const currentStatus = computed(
  () =>
    collectionBookStatus.value?.find(
      (status) => status.id === state.value.status,
    ),
);

function open(data: { id: string; name: string }, collections?: string[]) {
  isOpen.value = true;
  book.value = data;
  if (collections) inCollections.value = collections;
}

function close() {
  isOpen.value = false;
}

function handleCreate() {
  close();
  createOpen();
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!book.value.id) return;

  const res = await update(event.data.collection, {
    bookId: book.value.id,
    quantity: event.data.quantity,
    status: event.data.status,
  });

  if (res) {
    emit("update", res);
    close();
  }
}

const uiMenu = {
  height: "max-h-20",
};
</script>

<template>
  <UModal v-if="isAuthenticated && book" v-model="isOpen">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          {{ $t("library.addToLibrary") }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-dismiss-20-filled"
            class="-my-1"
            @click="close"
          />
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-3"
        @submit="onSubmit"
      >
        <div class="text-center">
          <UButton class="cursor-default" color="gray" block>
            {{ book.name }}
          </UButton>
          <UIcon class="my-3" name="i-fluent-arrow-down-20-filled" />
          <UFormGroup
            v-if="collections && collections.length > 0"
            name="collection"
          >
            <USelectMenu
              v-if="collections"
              v-model="state.collection"
              :ui-menu="uiMenu"
              :options="collections"
              value-attribute="id"
              option-attribute="label"
            >
              <UButton color="gray" block>
                <span v-if="currentCollection">
                  <strong>{{ $t("library.collection") }}</strong
                  >:
                  {{ currentCollection.label }}
                </span>
                <span v-else>
                  {{ $t("library.selectCollection") }}
                </span>
              </UButton>
            </USelectMenu>
          </UFormGroup>
          <UButton v-else color="gray" block @click="handleCreate">
            {{ $t("library.createCollection") }}
          </UButton>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <UFormGroup :label="$t('general.status')" name="status">
            <USelectMenu
              v-model="state.status"
              :options="collectionBookStatus"
              value-attribute="id"
              option-attribute="label"
            >
              <template #label>
                <span v-if="currentStatus">
                  {{ currentStatus.label }}
                </span>
                <span v-else>
                  {{ $t("general.statusSelect") }}
                </span>
              </template>
            </USelectMenu>
          </UFormGroup>
          <UFormGroup :label="$t('general.quantity')" name="quantity">
            <AppNumberInput v-model="state.quantity" />
          </UFormGroup>
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="red" variant="ghost" @click="close">
            {{ $t("general.return") }}
          </UButton>
          <UButton type="submit" :loading="pending">
            {{ $t("general.confirm") }}
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
