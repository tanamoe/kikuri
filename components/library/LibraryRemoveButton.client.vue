<script setup lang="ts">
import { ModalCollectionBookRemove } from "#components";

const modal = useModal();

interface Props {
  id: string;
  name: string;
  collection: string;
  square?: boolean;
}

const { id, name, collection } = defineProps<Props>();

const emit = defineEmits<{
  change: [];
}>();

function remove() {
  modal.open(ModalCollectionBookRemove, {
    book: {
      id,
      name,
    },
    collection,
    callback: () => emit("change"),
  });
}
</script>

<template>
  <UButton
    icon="i-fluent-delete-20-filled"
    v-bind="$attrs"
    square
    @click.prevent="remove"
  />
</template>
