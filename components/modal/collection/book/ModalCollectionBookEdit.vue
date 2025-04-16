<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { CollectionBooksStatusOptions } from "@/types/pb";
import { InputBookStatus } from "#components";

const toast = useToast();
const { t } = useI18n({ useScope: "global" });
const { pending, update } = useCollectionBooks();

const props = defineProps<{
  book: {
    id: string;
    name: string;
  };
  quantity: number;
  status: CollectionBooksStatusOptions;
  collection: string;
  callback?: () => unknown;
}>();

const emit = defineEmits<{
  close: [];
}>();

const schema = z.object({
  quantity: z.coerce.number().min(1),
  status: z.nativeEnum(CollectionBooksStatusOptions),
});

type Schema = z.output<typeof schema>;

const state = ref({
  quantity: props.quantity,
  status: props.status,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const [res, error] = await update(props.collection, {
    bookId: props.book.id,
    ...event.data,
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
    description: t("library.editBookSuccessful", {
      name: res.item.book?.publication?.name,
    }),
    icon: "i-fluent-checkmark-circle-20-filled",
  });
  if (props.callback) {
    props.callback();
  }
  emit("close");
}
</script>

<template>
  <UModal
    v-if="$pb.authStore.record"
    :title="t('library.editBook', { name: book.name })"
  >
    <template #body>
      <UForm :schema :state class="space-y-6" @submit="onSubmit">
        <div class="grid grid-cols-2 gap-3">
          <UFormField :label="$t('general.status')" name="status">
            <InputBookStatus v-model="state.status" class="w-full" />
          </UFormField>
          <UFormField :label="$t('general.quantity')" name="quantity">
            <UInputNumber v-model="state.quantity" :min="1" class="w-full" />
          </UFormField>
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="error" variant="ghost" @click="$emit('close')">
            {{ $t("general.return") }}
          </UButton>
          <UButton type="submit" :loading="pending">
            {{ $t("general.save") }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
