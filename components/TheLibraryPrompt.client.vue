<script setup lang="ts">
import { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import { Collections, type CollectionResponse } from "~/types/pb";

const { $pb } = useNuxtApp();
const { isOpen, book, state } = useLibraryPrompt();
const { isAuthenticated, currentUser } = useAuthentication();

const { data: collections } = await useLazyAsyncData(
  currentUser.value?.id || "unauthenticated",
  () =>
    $pb.collection(Collections.Collection).getFullList<CollectionResponse>({
      filter: `owner = '${currentUser.value?.id}'`,
    }),
  {
    transform: (collections) =>
      collections.map((collection) => ({
        id: collection.id,
        label: collection.name,
      })),
    watch: [currentUser],
  },
);

const schema = z.object({
  quantity: z.number().min(0),
  collection: z.string(),
  status: z.string(),
});

type Schema = z.output<typeof schema>;

const currentCollection = computed(
  () =>
    collections.value?.find(
      (collection) => collection.id === state.value.collection,
    ),
);

async function submit(event: FormSubmitEvent<Schema>) {
  // TODO: send this data to the CMS
}
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
            @click="isOpen = false"
          />
        </div>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-3" @submit="submit">
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
                  {{ $t("library.chooseCollection") }}
                </span>
              </UButton>
            </USelectMenu>
          </UFormGroup>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <UFormGroup :label="$t('library.status')" name="status">
            <USelect :options="['PLANNED', 'COMPLETED']" />
          </UFormGroup>
          <UFormGroup :label="$t('library.quantity')" name="quantity">
            <AppNumberInput v-model="state.quantity" />
          </UFormGroup>
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="red" variant="ghost" @click="isOpen = false">
            {{ $t("general.return") }}
          </UButton>
          <UButton type="submit">
            {{ $t("general.confirm") }}
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
