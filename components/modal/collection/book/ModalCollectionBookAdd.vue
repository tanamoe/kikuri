<script setup lang="ts">
import { z } from "zod";
import { joinURL } from "ufo";
import type { FormSubmitEvent } from "#ui/types";
import { CollectionBooksStatusOptions } from "@/types/pb";

const { $pb } = useNuxtApp();
const { t } = useI18n();
const { pending, update } = useCollectionBooks();
const { collections } = useLibrary();
const toast = useToast();
const settingsStore = useSettingsStore();
const modal = useModal();

const props = defineProps<{
  book: {
    id: string;
    name: string;
  };
  inCollections?: string[];
  callback?: () => unknown;
}>();

const c = computed(() =>
  collections.value.map((collection) => ({
    id: collection.collectionId,
    label: collection.collection?.name,
    disabled: props.inCollections?.includes(collection.collectionId) ?? false,
  })),
);

const schema = z.object({
  collection: z.string(),
  quantity: z.coerce.number().min(1),
  status: z.nativeEnum(CollectionBooksStatusOptions),
});
type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  collection: settingsStore.library.defaultLibraryId,
  quantity: 1,
  status: CollectionBooksStatusOptions.COMPLETED,
});

const currentCollection = computed(() =>
  c.value?.find((collection) => collection.id === state.value.collection),
);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const [res, error] = await update(event.data.collection, {
    bookId: props.book.id,
    quantity: event.data.quantity,
    status: event.data.status,
  });

  if (error) {
    return toast.add({
      title: t("error.generalMessage"),
      description: error.message,
      color: "red",
      icon: "i-fluent-error-circle-20-filled",
    });
  }

  toast.add({
    title: t("general.success"),
    description: t("library.addBookSuccessful", {
      name: res.item.book?.publication?.name,
      collection: res.item.collection?.name,
    }),
    icon: "i-fluent-checkmark-circle-20-filled",
    actions: [
      {
        label: t("library.goToCollection"),
        to: joinURL("/library", res.item.collectionId),
      },
    ],
  });

  if (props.callback) {
    props.callback();
  }
  return modal.close();
}

const uiMenu = {
  height: "max-h-20",
};
</script>

<template>
  <UModal v-if="$pb.authStore.isAuthRecord">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          {{ $t("library.addToLibrary") }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-dismiss-20-filled"
            class="-my-1"
            @click="modal.close"
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
          <UFormGroup v-if="c && c.length > 0" name="collection">
            <USelectMenu
              v-if="c"
              v-model="state.collection"
              :ui-menu="uiMenu"
              :options="c"
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
          <UButton
            v-else
            to="/library/create"
            color="gray"
            block
            @click="modal.close"
          >
            {{ $t("library.createCollection") }}
          </UButton>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <UFormGroup :label="$t('general.status')" name="status">
            <InputBookStatus v-model="state.status" />
          </UFormGroup>
          <UFormGroup :label="$t('general.quantity')" name="quantity">
            <AppNumberInput v-model="state.quantity" />
          </UFormGroup>
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="red" variant="ghost" @click="modal.close">
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
