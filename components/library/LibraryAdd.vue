<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import type { UserCollectionsResponse } from "@/types/collections";
import { CollectionBooksStatusOptions } from "@/types/pb";

const { $pb } = useNuxtApp();
const { pending, update } = useLibrary();
const { status } = useLibraryStatus();
const { isOpen, book, state, updateFn } = useLibraryPrompt();
const { isAuthenticated, currentUser } = useAuthentication();

const emit = defineEmits<{
  update: [void];
}>();

const { data: collections } = await useLazyAsyncData(
  () =>
    $pb.send<UserCollectionsResponse>("/api/user-collections", {
      method: "GET",
      expand: "collection",
    }),
  {
    transform: (collections) =>
      collections.items.map((collection) => ({
        id: collection.collectionId,
        label: collection.collection?.name,
      })),
    watch: [currentUser],
  },
);

const schema = z.object({
  quantity: z.coerce.number().min(0),
  collection: z.string(),
  status: z.nativeEnum(CollectionBooksStatusOptions),
});

type Schema = z.output<typeof schema>;

const currentCollection = computed(
  () =>
    collections.value?.find(
      (collection) => collection.id === state.value.collection,
    ),
);

const currentStatus = computed(
  () => status.value?.find((status) => status.id === state.value.status),
);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const res = await update({
    collectionId: event.data.collection,
    bookId: book.value!.id,
    quantity: event.data.quantity,
    status: event.data.status,
  });

  if (res) {
    emit("update");
    isOpen.value.add = false;
    if (updateFn.value) updateFn.value();
  }
}
</script>

<template>
  <UModal v-if="isAuthenticated && book" v-model="isOpen.add">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          {{ $t("library.addToLibrary") }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-dismiss-20-filled"
            class="-my-1"
            @click="isOpen.add = false"
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
          <UFormGroup name="collection">
            <USelectMenu
              v-if="collections"
              v-model="state.collection"
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
        </div>

        <div class="grid grid-cols-2 gap-3">
          <UFormGroup :label="$t('general.status')" name="status">
            <USelectMenu
              v-model="state.status"
              :options="status"
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
          <UButton color="red" variant="ghost" @click="isOpen.add = false">
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
