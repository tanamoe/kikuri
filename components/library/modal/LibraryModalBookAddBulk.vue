<script setup lang="ts">
import { z } from "zod";
import { joinURL } from "ufo";
import type { FormSubmitEvent } from "#ui/types";
import { CollectionBooksStatusOptions } from "@/types/pb";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const { pending, progress, update } = useCollectionBooks();
const { collectionBookStatus } = useOptions();
const { collections } = useLibrary();
const toast = useToast();
const settingsStore = useSettingsStore();
const modal = useModal();

const props = defineProps<{
  books: {
    id?: string;
    name?: string;
  }[];
  callback?: () => any;
}>();

const c = computed(() =>
  collections.value.map((collection) => ({
    id: collection.collectionId,
    label: collection.collection?.name,
  })),
);

const p = computed(() => (progress.value / props.books.length) * 100);

const schema = z.object({
  collection: z.string(),
  quantity: z.coerce.number().min(0),
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
const currentStatus = computed(() =>
  collectionBookStatus.value?.find(
    (status) => status.id === state.value.status,
  ),
);

function handleClose() {
  modal.isOpen.value = false;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const [res, error] = await update(
    event.data.collection,
    props.books.map((book) => ({
      bookId: book.id ?? "",
      quantity: event.data.quantity,
      status: event.data.status,
    })),
  );

  if (error.length > 0) {
    toast.add({
      title: t("error.generalMessage"),
      description: error.map((e) => e.message).join("\n"),
      color: "red",
      icon: "i-fluent-error-circle-20-filled",
    });
  }

  toast.add({
    title: t("general.success"),
    description: t("library.addBookBulkSuccessful", {
      count: res.length,
    }),
    icon: "i-fluent-checkmark-circle-20-filled",
    actions: [
      {
        label: t("library.goToCollection"),
        to: joinURL("/library", event.data.collection),
      },
    ],
  });
  if (props.callback) {
    props.callback();
  }
  return handleClose();
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
            @click="handleClose"
          />
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-3"
        @submit="onSubmit"
      >
        <p>
          {{
            $t("library.addToLibraryBulkDescription", {
              quantity: books.length,
            })
          }}
        </p>

        <div class="text-center">
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
            @click="handleClose"
          >
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

        <UProgress v-if="pending" :value="p" indicator />

        <div class="flex justify-end gap-3">
          <UButton color="red" variant="ghost" @click="handleClose">
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
