<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { CollectionBooksStatusOptions } from "@/types/pb";

const { pending, update } = useLibrary();
const { status } = useLibraryStatus();
const { updateFn, isOpen, book, state } = useLibraryPrompt();
const { isAuthenticated } = useAuthentication();

const emit = defineEmits<{
  update: [void];
}>();

const schema = z.object({
  quantity: z.coerce.number().min(0),
  collection: z.string(),
  status: z.nativeEnum(CollectionBooksStatusOptions),
});

type Schema = z.output<typeof schema>;

const currentStatus = computed(
  () => status.value?.find((status) => status.id === state.value.status),
);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!book.value) return;

  const res = await update({
    collectionId: event.data.collection,
    bookId: book.value.id,
    quantity: event.data.quantity,
    status: event.data.status,
  });

  if (res) {
    emit("update");
    isOpen.value.edit = false;
    if (updateFn.value) updateFn.value();
  }
}
</script>

<template>
  <UModal v-if="isAuthenticated && book" v-model="isOpen.edit">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          {{ $t("library.editBook", { name: book.name }) }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-dismiss-20-filled"
            class="-my-1"
            @click="isOpen.edit = false"
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
          <UButton color="red" variant="ghost" @click="isOpen.edit = false">
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
