<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { CollectionBooksStatusOptions } from "@/types/pb";
import type { UserCollectionBookResponse } from "@/types/collections";

const { pending, update } = useLibraryBook();
const { collectionBookStatus } = useOptions();

const emit = defineEmits<{
  update: [UserCollectionBookResponse];
}>();

defineExpose({
  open,
  close,
});

const isOpen = ref(false);

const schema = z.object({
  quantity: z.coerce.number().min(0),
  collection: z.string(),
  status: z.nativeEnum(CollectionBooksStatusOptions),
});

type Schema = z.output<typeof schema>;

const book = ref<{
  id?: string;
  name?: string;
}>({});
const state = ref<Partial<Schema>>({});

const currentStatus = computed(() =>
  collectionBookStatus.value.find((status) => status.id === state.value.status),
);

function open(
  data: {
    id: string;
    name: string;
  },
  value: Schema,
) {
  isOpen.value = true;
  book.value = data;
  state.value = value;
}

function close() {
  isOpen.value = false;
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
</script>

<template>
  <UModal v-if="$pb.authStore.isAuthRecord && book" v-model="isOpen">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          {{ $t("library.editBook", { name: book.name }) }}
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
            {{ $t("general.save") }}
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
