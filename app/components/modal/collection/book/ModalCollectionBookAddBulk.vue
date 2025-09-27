<script setup lang="ts">
import { z } from "zod";
import { joinURL } from "ufo";
import type { FormSubmitEvent } from "#ui/types";
import { CollectionBooksStatusOptions } from "@/types/pb";

const { $pb } = useNuxtApp();
const { t } = useI18n();
const { pending, progress, update } = useCollectionBooks();
const { collections } = useLibrary();
const toast = useToast();
const settingsStore = useSettingsStore();

const props = defineProps<{
  books: {
    id: string;
    name?: string;
  }[];
  callback?: () => unknown;
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

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const [res, error] = await update(
    event.data.collection,
    props.books.map((book) => ({
      bookId: book.id,
      quantity: event.data.quantity,
      status: event.data.status,
    })),
  );

  if (error.length > 0) {
    toast.add({
      title: t("error.generalMessage"),
      description: error.map((e) => e.message).join("\n"),
      color: "error",
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
}

const uiMenu = {
  height: "max-h-20",
};
</script>

<template>
  <UModal v-if="$pb.authStore.record">
    <template #header>
      <div class="flex items-center justify-between">
        {{ $t("library.addToLibrary") }}
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-fluent-dismiss-20-filled"
          class="-my-1"
        />
      </div>
    </template>

    <template #body>
      <UForm :schema :state class="space-y-3" @submit="onSubmit">
        <p>
          {{
            $t("library.addToLibraryBulkDescription", {
              quantity: books.length,
            })
          }}
        </p>

        <div class="text-center">
          <UFormField v-if="c && c.length > 0" name="collection">
            <USelectMenu
              v-if="c"
              v-model="state.collection"
              :ui-menu="uiMenu"
              :options="c"
              value-key="id"
            >
              <UButton color="neutral" block>
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
          </UFormField>
          <UButton v-else to="/library/create" color="neutral" block>
            {{ $t("library.createCollection") }}
          </UButton>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <UFormField :label="$t('general.status')" name="status">
            <InputBookStatus v-model="state.status" />
          </UFormField>
          <UFormField :label="$t('general.quantity')" name="quantity">
            <UNumberInput v-model="state.quantity" />
          </UFormField>
        </div>

        <UProgress v-if="pending" :value="p" indicator />

        <div class="flex justify-end gap-3">
          <UButton color="error" variant="ghost">
            {{ $t("general.return") }}
          </UButton>
          <UButton type="submit" :loading="pending">
            {{ $t("general.confirm") }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
