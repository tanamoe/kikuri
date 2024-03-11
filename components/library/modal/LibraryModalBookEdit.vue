<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { CollectionBooksStatusOptions } from "@/types/pb";

const toast = useToast();
const { t } = useI18n({ useScope: "global" });
const { pending, update } = useCollectionBooks();
const { collectionBookStatus } = useOptions();
const modal = useModal();

const schema = z.object({
  quantity: z.coerce.number().min(0),
  collection: z.string(),
  status: z.nativeEnum(CollectionBooksStatusOptions),
});

type Schema = z.output<typeof schema>;

const props = defineProps<{
  book: {
    id: string;
    name: string;
  };
  state: Partial<Schema>;
  callback?: () => any;
}>();

const s = ref(props.state);

const currentStatus = computed(() =>
  collectionBookStatus.value.find((status) => status.id === props.state.status),
);

function handleClose() {
  modal.isOpen.value = false;
}

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
    description: t("library.editBookSuccessful", {
      name: res.item.book?.publication.name,
    }),
    icon: "i-fluent-checkmark-circle-20-filled",
  });

  if (props.callback) {
    props.callback();
  }
  return handleClose();
}
</script>

<template>
  <UModal v-if="$pb.authStore.isAuthRecord">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          {{ $t("library.editBook", { name: book.name }) }}
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
        <div class="grid grid-cols-2 gap-3">
          <UFormGroup :label="$t('general.status')" name="status">
            <USelectMenu
              v-model="s.status"
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
            <AppNumberInput v-model="s.quantity" />
          </UFormGroup>
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="red" variant="ghost" @click="handleClose">
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
