<script setup lang="ts">
import { z } from "zod";
import { joinURL } from "ufo";
import type { FormSubmitEvent, ModalProps } from "#ui/types";
import { CollectionBooksStatusOptions } from "@/types/pb";
import type { MetadataLibrary } from "@/types/common";

const { $pb } = useNuxtApp();
const { t } = useI18n();
const { pending, update } = useCollectionBooks();
const { collections } = useLibrary();
const toast = useToast();
const settingsStore = useSettingsStore();

const form = useTemplateRef("form");

const props = defineProps<{
  book: {
    id: string;
    name: string;
  };
  inCollections?: MetadataLibrary["inCollections"];
  callback?: () => unknown;
}>();

const c = computed(() =>
  collections.value.map((collection) => ({
    id: collection.collectionId,
    label: collection.collection?.name,
    disabled:
      props.inCollections
        ?.map((collection) => collection.id)
        .includes(collection.collectionId) ?? false,
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
    toast.add({
      title: t("error.generalMessage"),
      description: error.message,
      color: "error",
      icon: "i-fluent-error-circle-20-filled",
    });

    return;
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
}

const ui: ModalProps["ui"] = {
  footer: "justify-end",
};
</script>

<template>
  <UModal v-if="$pb.authStore.record" :ui>
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
      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        class="space-y-3"
        @submit="onSubmit"
      >
        <div class="text-center">
          <UButton color="neutral" variant="soft" block>
            {{ book.name }}
          </UButton>
          <UIcon class="my-3" name="i-fluent-arrow-down-20-filled" />
          <UFormField v-if="c && c.length > 0" name="collection">
            <USelectMenu
              v-if="c"
              v-model="state.collection"
              :items="c"
              value-key="id"
              option-key="label"
              class="w-full"
              icon="i-fluent-library-20-filled"
            >
              <span v-if="currentCollection">
                <strong>{{ $t("library.collection") }}</strong
                >:
                {{ currentCollection.label }}
              </span>
              <span v-else>
                {{ $t("library.selectCollection") }}
              </span>
            </USelectMenu>
          </UFormField>
          <UButton v-else to="/library/create" color="neutral" block>
            {{ $t("library.createCollection") }}
          </UButton>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <UFormField :label="$t('general.status')" name="status">
            <InputBookStatus v-model="state.status" class="w-full" />
          </UFormField>
          <UFormField :label="$t('general.quantity')" name="quantity">
            <UInputNumber v-model="state.quantity" class="w-full" />
          </UFormField>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton color="error" variant="ghost">
          {{ $t("general.return") }}
        </UButton>
        <UButton :loading="pending" @click="form?.submit">
          {{ $t("general.confirm") }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
