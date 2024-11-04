<script setup lang="ts">
import { ModalCollectionBookEdit } from "#components";
import type { CollectionBooksStatusOptions } from "~/types/pb";

const modal = useModal();

interface Props {
  id: string;
  name: string;
  collection: string;
  quantity: number;
  status: CollectionBooksStatusOptions;
  square?: boolean;
}

const { id, name, collection, quantity, status } = defineProps<Props>();

const emit = defineEmits<{
  change: [];
}>();

function edit() {
  modal.open(ModalCollectionBookEdit, {
    book: {
      id,
      name,
    },
    collection,
    quantity,
    status,
    callback: () => emit("change"),
  });
}
</script>

<template>
  <UButton
    icon="i-fluent-edit-20-filled"
    v-bind="$attrs"
    square
    @click.prevent="edit"
  />
</template>
