<script setup lang="ts">
import { ModalCollectionBookEdit } from "#components";
import type { CollectionBooksStatusOptions } from "~/types/pb";

const overlay = useOverlay();
const modal = overlay.create(ModalCollectionBookEdit);

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
  modal.open({
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
